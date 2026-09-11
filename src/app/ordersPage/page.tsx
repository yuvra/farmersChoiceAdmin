"use client";

import { useEffect, useMemo, useState } from "react";
import {
	getDocs,
	updateDoc,
	doc,
	collection,
	type QueryDocumentSnapshot,
	type DocumentData,
} from "firebase/firestore";
import { CopyOutlined } from "@ant-design/icons";
import { db } from "@/firebase/config";
import {
	Card,
	Modal,
	Select,
	Typography,
	Row,
	Col,
	Input,
	Empty,
	Space,
	Tag,
	Divider,
	Statistic,
	Descriptions,
	Tooltip,
	Button,
	Collapse,
	DatePicker,
	App,
	Alert,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

type OrderStatus =
	| "Processing your order"
	| "Packed"
	| "Shipped"
	| "Delivered"
	| "Cancelled";

type DateSortOrder = "newest" | "oldest";

const PICKUP_LOCATIONS = [
	"Rahuri",
	"Gagangari krushi sewa kendra",
	"Dronagiri",
] as const;

const DEFAULT_PICKUP_LOCATION = "Rahuri";

const getOrderDate = (createdAt: any): Date | null => {
	if (!createdAt) return null;
	const raw = createdAt?.toDate?.() || createdAt;
	const date = new Date(raw);
	return Number.isNaN(date.getTime()) ? null : date;
};

const formatOrderDate = (createdAt: any): string => {
	const date = getOrderDate(createdAt);
	if (!date) return "N/A";
	return dayjs(date).format("DD MMM YYYY, hh:mm A");
};

const getLatestOrderDate = (user: any): Date | null => {
	const orders = user?.orders ?? [];
	let latest: Date | null = null;
	for (const order of orders) {
		const date = getOrderDate(order.createdAt);
		if (!date) continue;
		if (!latest || date.getTime() > latest.getTime()) {
			latest = date;
		}
	}
	return latest;
};

export default function OrdersPage() {
	const { modal, message } = App.useApp();
	const [users, setUsers] = useState<any[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
	const [cityFilter, setCityFilter] = useState<string | null>(null);
	const [dateSort, setDateSort] = useState<DateSortOrder>("newest");
	const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
		null
	);
	const [creatingShipmentFor, setCreatingShipmentFor] = useState<string | null>(
		null
	);
	const [delhiveryConfirm, setDelhiveryConfirm] = useState<{
		userId: string;
		orderId: string;
		pincode: string;
	} | null>(null);
	const [pickupLocation, setPickupLocation] = useState<string>(
		DEFAULT_PICKUP_LOCATION
	);
	const [pinCheck, setPinCheck] = useState<{
		loading: boolean;
		serviceable: boolean | null;
		detail: string;
	}>({ loading: false, serviceable: null, detail: "" });

	// Fetch orders
	useEffect(() => {
		const fetchOrders = async () => {
			const snap = await getDocs(
				collection(db, "userProfilesAndOrderStatus")
			);
			const userList = snap.docs.map(
				(d: QueryDocumentSnapshot<DocumentData>) => ({
					id: d.id,
					...d.data(),
				})
			);

			setUsers(userList);
			applyFilters(
				searchValue,
				statusFilter,
				cityFilter,
				dateSort,
				dateRange,
				userList
			);
		};

		fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateStatus = async (
		userId: string,
		orderId: string,
		newStatus: OrderStatus
	) => {
		const user = users.find((u) => u.id === userId);
		const updatedOrders = (user?.orders ?? []).map((order: any) =>
			order.id === orderId ? { ...order, status: newStatus } : order
		);
		await updateDoc(doc(db, "userProfilesAndOrderStatus", userId), {
			orders: updatedOrders,
		});
		const updatedUser = { ...user, orders: updatedOrders };
		const nextUsers = users.map((u) => (u.id === userId ? updatedUser : u));
		setUsers(nextUsers);
		applyFilters(
			searchValue,
			statusFilter,
			cityFilter,
			dateSort,
			dateRange,
			nextUsers
		);
		setSelectedUser(updatedUser);
	};

	const patchOrderDelhivery = (
		userId: string,
		orderId: string,
		waybill: string | null,
		createdAt: string | null
	) => {
		const nextUsers = users.map((u) => {
			if (u.id !== userId) return u;
			const updatedOrders = (u.orders ?? []).map((order: any) => {
				if (order.id !== orderId) return order;
				const next = { ...order };
				if (waybill) {
					next.delhiveryWaybill = waybill;
					next.delhiveryCreatedAt = createdAt;
				} else {
					delete next.delhiveryWaybill;
					delete next.delhiveryCreatedAt;
					delete next.delhiveryOrderRef;
				}
				return next;
			});
			return { ...u, orders: updatedOrders };
		});
		setUsers(nextUsers);
		applyFilters(
			searchValue,
			statusFilter,
			cityFilter,
			dateSort,
			dateRange,
			nextUsers
		);
		const updatedSelected = nextUsers.find((u) => u.id === userId) || null;
		setSelectedUser(updatedSelected);
	};

	const clearDelhiveryShipment = (userId: string, orderId: string) => {
		modal.confirm({
			title: "Create again on Delhivery?",
			content:
				"This clears the saved Delhivery waybill on this order so you can create a new shipment. Only do this if you already deleted it on Delhivery.",
			okText: "Clear & create again",
			cancelText: "Cancel",
			onOk: async () => {
				const user = users.find((u) => u.id === userId);
				const updatedOrders = (user?.orders ?? []).map((order: any) => {
					if (order.id !== orderId) return order;
					const next = { ...order };
					delete next.delhiveryWaybill;
					delete next.delhiveryCreatedAt;
					delete next.delhiveryOrderRef;
					return next;
				});
				await updateDoc(doc(db, "userProfilesAndOrderStatus", userId), {
					orders: updatedOrders,
				});
				patchOrderDelhivery(userId, orderId, null, null);
				message.success("Delhivery link cleared. You can create again.");
				createOnDelhivery(userId, orderId);
			},
		});
	};

	const resolveOrderPincode = (userId: string, orderId: string) => {
		const user = users.find((u) => u.id === userId);
		const order = (user?.orders ?? []).find((o: any) => o.id === orderId);
		const profile = user?.profile?.[0] || {};
		const addr = order?.shippingAddress || order?.address || profile;
		return String(addr?.pincode || profile?.pincode || "").trim();
	};

	const checkPincodeServiceability = async (pincode: string) => {
		if (!/^\d{6}$/.test(pincode)) {
			setPinCheck({
				loading: false,
				serviceable: false,
				detail: pincode
					? `Invalid pincode: ${pincode}`
					: "Order is missing a destination pincode",
			});
			return;
		}

		setPinCheck({
			loading: true,
			serviceable: null,
			detail: `Checking pincode ${pincode}…`,
		});

		try {
			const res = await fetch(
				`/api/v1/delhivery/pincode?pin_code=${encodeURIComponent(pincode)}`
			);
			const data = await res.json().catch(() => ({}));
			const codes = data?.delivery_codes;
			const postal = codes?.[0]?.postal_code;
			if (!Array.isArray(codes) || !codes.length || !postal) {
				setPinCheck({
					loading: false,
					serviceable: false,
					detail: `Pincode ${pincode} is not serviceable on Delhivery`,
				});
				return;
			}

			const prepaidOk = String(postal.pre_paid || "").toUpperCase() === "Y";
			const codOk = String(postal.cod || "").toUpperCase() === "Y";
			setPinCheck({
				loading: false,
				serviceable: prepaidOk || codOk,
				detail: prepaidOk || codOk
					? `Pincode ${pincode} is serviceable (${postal.district || postal.state_code || "OK"})`
					: `Pincode ${pincode} is not serviceable for Prepaid/COD`,
			});
		} catch {
			setPinCheck({
				loading: false,
				serviceable: null,
				detail: `Could not verify pincode ${pincode}. You can still try creating.`,
			});
		}
	};

	const createOnDelhivery = (userId: string, orderId: string) => {
		const pincode = resolveOrderPincode(userId, orderId);
		setPickupLocation(DEFAULT_PICKUP_LOCATION);
		setDelhiveryConfirm({ userId, orderId, pincode });
		void checkPincodeServiceability(pincode);
	};

	const submitDelhiveryShipment = async () => {
		if (!delhiveryConfirm) return;
		if (!pickupLocation.trim()) {
			message.error("Please select a pickup location");
			return;
		}
		if (pinCheck.serviceable === false) {
			message.error(
				pinCheck.detail ||
					"Destination pincode is not serviceable on Delhivery"
			);
			return;
		}

		const { userId, orderId } = delhiveryConfirm;
		setCreatingShipmentFor(orderId);
		try {
			const res = await fetch("/api/v1/delhivery/create-shipment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId,
					orderId,
					pickupLocation: pickupLocation.trim(),
				}),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				message.error(
					data?.error || "Failed to create Delhivery shipment"
				);
				return;
			}
			patchOrderDelhivery(
				userId,
				orderId,
				data.waybill,
				data.delhiveryCreatedAt || new Date().toISOString()
			);
			message.success(`Delhivery waybill: ${data.waybill}`);
			setDelhiveryConfirm(null);
		} catch (err) {
			message.error(
				err instanceof Error
					? err.message
					: "Failed to create Delhivery shipment"
			);
		} finally {
			setCreatingShipmentFor(null);
		}
	};

	const orderMatchesDateRange = (
		order: any,
		range: [Dayjs | null, Dayjs | null] | null
	) => {
		if (!range?.[0] || !range?.[1]) return true;
		const orderDate = getOrderDate(order.createdAt);
		if (!orderDate) return false;
		const start = range[0].startOf("day").valueOf();
		const end = range[1].endOf("day").valueOf();
		const time = orderDate.getTime();
		return time >= start && time <= end;
	};

	const applyFilters = (
		search: string,
		status: OrderStatus | null,
		city: string | null,
		sort: DateSortOrder,
		range: [Dayjs | null, Dayjs | null] | null,
		sourceUsers = users
	) => {
		let filtered = [...sourceUsers];

		if (search.trim()) {
			filtered = filtered.filter((user) =>
				user.profile?.[0]?.phone?.includes(search.trim())
			);
		}

		if (status) {
			filtered = filtered.filter((user) =>
				(user.orders ?? []).some(
					(order: any) => order.status === status
				)
			);
		}

		if (city) {
			filtered = filtered.filter(
				(user) => user.profile?.[0]?.city === city
			);
		}

		if (range?.[0] && range?.[1]) {
			filtered = filtered.filter((user) =>
				(user.orders ?? []).some((order: any) =>
					orderMatchesDateRange(order, range)
				)
			);
		}

		filtered.sort((a: any, b: any) => {
			const aTime = getLatestOrderDate(a)?.getTime() || 0;
			const bTime = getLatestOrderDate(b)?.getTime() || 0;
			return sort === "newest" ? bTime - aTime : aTime - bTime;
		});

		setFilteredUsers(filtered);
	};

	const handleSearch = (value: string) => {
		setSearchValue(value);
		applyFilters(value, statusFilter, cityFilter, dateSort, dateRange);
	};

	const handleStatusFilter = (value: OrderStatus | null) => {
		setStatusFilter(value);
		applyFilters(searchValue, value, cityFilter, dateSort, dateRange);
	};

	const handleCityFilter = (value: string | null) => {
		setCityFilter(value);
		applyFilters(searchValue, statusFilter, value, dateSort, dateRange);
	};

	const handleDateSort = (value: DateSortOrder) => {
		setDateSort(value);
		applyFilters(searchValue, statusFilter, cityFilter, value, dateRange);
	};

	const handleDateRange = (
		value: [Dayjs | null, Dayjs | null] | null
	) => {
		setDateRange(value);
		applyFilters(searchValue, statusFilter, cityFilter, dateSort, value);
	};

	const getStatusTag = (status: OrderStatus) => {
		const colorMap: Record<OrderStatus, string> = {
			"Processing your order": "blue",
			Packed: "purple",
			Shipped: "orange",
			Delivered: "green",
			Cancelled: "red",
		};
		return (
			<Tag
				color={colorMap[status] || "default"}
				style={{ fontWeight: 500 }}
			>
				{status}
			</Tag>
		);
	};

	const uniqueCities = [
		...new Set(users.map((u) => u.profile?.[0]?.city).filter(Boolean)),
	];

	// ------- NEW: Global status stats (including Cancelled) -------
	const statusCounts = useMemo(() => {
		const counts: Record<OrderStatus, number> = {
			"Processing your order": 0,
			Packed: 0,
			Shipped: 0,
			Delivered: 0,
			Cancelled: 0,
		};
		let total = 0;
		users.forEach((u) => {
			(u.orders ?? []).forEach((o: any) => {
				if (counts[o.status as OrderStatus] !== undefined) {
					counts[o.status as OrderStatus] += 1;
				}
				total += 1;
			});
		});
		return { counts, total };
	}, [users]);

	const cancelledPct =
		statusCounts.total > 0
			? Math.round(
					(statusCounts.counts.Cancelled / statusCounts.total) * 100
			  )
			: 0;

	// Build a single-line plain address for copy/share
	const formatAddressPlain = (addr?: any) => {
		if (!addr) return "";
		const parts = [
			addr?.name ? `Name: ${addr.name}` : null,
			addr?.phone ? `Phone: ${addr.phone}` : null,
			addr?.flat ? `Flat / House No.: ${addr.flat}` : null,
			addr?.street ? `Street: ${addr.street}` : null,
			addr?.landmark ? `Landmark: ${addr.landmark}` : null,
			addr?.city ? `City: ${addr.city}` : null,
			addr?.district ? `District: ${addr.district}` : null,
			addr?.pincode ? `Pincode: ${addr.pincode}` : null,
			addr?.state ? `State: ${addr.state}` : null,
			addr?.country ? `Country: ${addr.country}` : null,
		].filter(Boolean);
		return parts.join(", ");
	};

	// Render key–value address block using AntD Descriptions
	const renderAddressKV = (addr?: any) => {
		if (!addr) return null;
		const fields: { key: string; label: string; value: any }[] = [
			{ key: "name", label: "Name", value: addr.name },
			{ key: "phone", label: "Phone", value: addr.phone },
			{ key: "flat", label: "Flat / House No.", value: addr.flat },
			{ key: "street", label: "Street", value: addr.street },
			{ key: "landmark", label: "Landmark", value: addr.landmark },
			{ key: "city", label: "City", value: addr.city },
			{ key: "district", label: "District", value: addr.district },
			{ key: "pincode", label: "Pincode", value: addr.pincode },
			{ key: "state", label: "State", value: addr.state },
			{ key: "country", label: "Country", value: addr.country },
		];

		return (
			<Descriptions
				size="small"
				column={1}
				labelStyle={{ color: "#fff" }}
				contentStyle={{ color: "#fff" }}
			>
				{fields.map((f) => (
					<Descriptions.Item key={f.key} label={f.label}>
						{f.value || (
							<span style={{ opacity: 0.45 }}>—</span>
						)}
					</Descriptions.Item>
				))}
			</Descriptions>
		);
	};
	return (
		<div style={{ padding: "24px" }}>
			<Title level={3}>Customer Orders</Title>

			{/* Filters */}
			<Space style={{ marginBottom: 16 }} wrap>
				<Search
					placeholder="Search by mobile number"
					value={searchValue}
					onChange={(e) => handleSearch(e.target.value)}
					onSearch={handleSearch}
					allowClear
					style={{ width: 250 }}
				/>

				<Select
					placeholder="Filter by Status"
					value={statusFilter || undefined}
					allowClear
					style={{ width: 220 }}
					onChange={(val) =>
						handleStatusFilter((val as OrderStatus) || null)
					}
				>
					<Option value="Processing your order">Processing</Option>
					<Option value="Packed">Packed</Option>
					<Option value="Shipped">Shipped</Option>
					<Option value="Delivered">Delivered</Option>
					<Option value="Cancelled">Cancelled</Option>
				</Select>

				<Select
					placeholder="Filter by City"
					value={cityFilter || undefined}
					allowClear
					style={{ width: 200 }}
					onChange={(val) => handleCityFilter(val || null)}
				>
					{uniqueCities.map((city) => (
						<Option key={city} value={city}>
							{city}
						</Option>
					))}
				</Select>

				<Select
					value={dateSort}
					style={{ width: 180 }}
					onChange={(val) => handleDateSort(val as DateSortOrder)}
				>
					<Option value="newest">Newest first</Option>
					<Option value="oldest">Oldest first</Option>
				</Select>

				<RangePicker
					value={dateRange}
					onChange={(dates) =>
						handleDateRange(
							dates as [Dayjs | null, Dayjs | null] | null
						)
					}
					allowClear
					format="DD MMM YYYY"
					placeholder={["From date", "To date"]}
				/>
			</Space>

			{/* NEW: Quick Stats */}
			<Card size="small" style={{ marginBottom: 16 }}>
				<Space wrap>
					<Statistic
						title="Total Orders"
						value={statusCounts.total}
					/>
					<Statistic
						title="Processing"
						value={statusCounts.counts["Processing your order"]}
						prefix={getStatusTag("Processing your order")}
					/>
					<Statistic
						title="Packed"
						value={statusCounts.counts.Packed}
						prefix={getStatusTag("Packed")}
					/>
					<Statistic
						title="Shipped"
						value={statusCounts.counts.Shipped}
						prefix={getStatusTag("Shipped")}
					/>
					<Statistic
						title="Delivered"
						value={statusCounts.counts.Delivered}
						prefix={getStatusTag("Delivered")}
					/>
					<Divider type="vertical" />
					<Statistic
						title="Cancelled"
						value={statusCounts.counts.Cancelled}
						prefix={getStatusTag("Cancelled")}
						suffix={` (${cancelledPct}%)`}
					/>
				</Space>
			</Card>

			{/* User Cards */}
			<Row gutter={[16, 16]}>
				{filteredUsers.length === 0 ? (
					<Empty
						description="No matching users found"
						style={{ margin: "auto" }}
					/>
				) : (
					filteredUsers.map((user) => {
						const profile = user.profile?.[0] || {};
						const latestOrderDate = getLatestOrderDate(user);
						return (
							<Col key={user.id} xs={24} sm={12} md={8}>
								<Card
									title={profile.name}
									bordered
									hoverable
									onClick={() => {
										setSelectedUser(user);
										setModalOpen(true);
									}}
								>
									<p>
										<Text type="secondary">
											📞 {profile.phone}
										</Text>
									</p>
									<p>
										<Text type="secondary">
											📍 {profile.city}, {profile.state}
										</Text>
									</p>
									<p>
										<Text strong>
											🛒 Orders:{" "}
											{user.orders?.length || 0}
										</Text>
									</p>
									<p>
										<Text type="secondary">
											📅 Latest order:{" "}
											{latestOrderDate
												? dayjs(latestOrderDate).format(
														"DD MMM YYYY"
												  )
												: "N/A"}
										</Text>
									</p>
								</Card>
							</Col>
						);
					})
				)}
			</Row>

			{/* Order Modal */}
			<Modal
				title={`Orders Details of :  ${selectedUser?.profile?.[0]?.name} `}
				open={modalOpen}
				onCancel={() => {
					setModalOpen(false);
					setSelectedUser(null);
				}}
				footer={null}
				width={800}
			>
				{/* Customer Details (Profile) */}
				{/* Customer Details (Profile) */}
				{selectedUser && (
					<Card
						size="small"
						style={{
							marginBottom: 16,
							background: "#000",
							color: "#fff",
						}}
						bodyStyle={{ color: "#fff" }}
					>
						<Descriptions
							title="Customer Details"
							size="small"
							column={1}
							labelStyle={{ color: "#fff" }}
							contentStyle={{ color: "#fff" }}
						>
							<Descriptions.Item label="Name">
								{selectedUser.profile?.[0]?.name || "-"}
							</Descriptions.Item>
							<Descriptions.Item label="Phone">
								{selectedUser.profile?.[0]?.phone || "-"}
							</Descriptions.Item>
							<Descriptions.Item label="City / State">
								{[
									selectedUser.profile?.[0]?.city,
									selectedUser.profile?.[0]?.state,
								]
									.filter(Boolean)
									.join(", ") || "-"}
							</Descriptions.Item>
						</Descriptions>

						{/* Profile Address (collapsible, black) */}
						<Collapse
							defaultActiveKey={[]}
							style={{ background: "transparent", marginTop: 12 }}
						>
							<Collapse.Panel
								key="profileAddress"
								header={
									<span style={{ color: "#fff" }}>
										Profile Address
									</span>
								}
								style={{
									background: "#000",
									border: "1px solid #333",
								}}
							>
								<Space
									align="center"
									style={{
										width: "100%",
										justifyContent: "space-between",
										marginBottom: 8,
									}}
								>
									<Title
										level={5}
										style={{ color: "#fff", margin: 0 }}
									>
										Address
									</Title>
									{formatAddressPlain(
										selectedUser.profile?.[0]
									) && (
										<Tooltip title="Copy full address">
											<Button
												type="text"
												size="small"
												icon={<CopyOutlined />}
												onClick={() =>
													navigator.clipboard?.writeText(
														formatAddressPlain(
															selectedUser
																.profile?.[0]
														)
													)
												}
												style={{ color: "#fff" }}
											/>
										</Tooltip>
									)}
								</Space>
								{renderAddressKV(selectedUser.profile?.[0])}
							</Collapse.Panel>
						</Collapse>
					</Card>
				)}
				{/* Orders */}
				{[...(selectedUser?.orders || [])]
					.filter((order) => orderMatchesDateRange(order, dateRange))
					.sort((a, b) => {
						const aTime = getOrderDate(a.createdAt)?.getTime() || 0;
						const bTime = getOrderDate(b.createdAt)?.getTime() || 0;
						return dateSort === "newest"
							? bTime - aTime
							: aTime - bTime;
					})
					.map((order: any, idx: number) => {
						const shippingAddr =
							order.shippingAddress || order.address; // use order-level address if present
						const copyAddressText =
							formatAddressPlain(shippingAddr) ||
							formatAddressPlain(selectedUser?.profile?.[0]);

						return (
							<Card
								key={idx}
								type="inner"
								title={`Order ID: ${order.id}`}
								style={{ marginBottom: 16 }}
							>
								<p>
									Date of Order:{" "}
									<Text strong>
										{formatOrderDate(order.createdAt)}
									</Text>
								</p>
								<p>
									Status:{" "}
									{getStatusTag(order.status as OrderStatus)}
								</p>
								<p>Payment: {order.paymentMethod}</p>
								<p>Amount: ₹{order.totalAmount}</p>
								{order.delhiveryWaybill && (
									<p>
										Delhivery Waybill:{" "}
										<Text strong copyable>
											{order.delhiveryWaybill}
										</Text>
									</p>
								)}
								{/* Items */}
								<Row gutter={[12, 12]}>
									{(order.items ?? []).map(
										(item: any, i: number) => (
											<Col xs={12} sm={8} key={i}>
												<Card
													hoverable
													cover={
														<img
															alt="product"
															src={
																item.product
																	?.productImages?.[0]
															}
															style={{
																height: 100,
																objectFit:
																	"contain",
																padding: 8,
															}}
														/>
													}
												>
													<Text strong>
														{
															item.product
																?.productName
																?.en
														}
													</Text>
													<p>
														Type:{" "}
														{
															item.product
																?.productType
																?.en
														}
													</p>
													<p>Qty: {item.quantity}</p>
												</Card>
											</Col>
										)
									)}
								</Row>

								{/* Shipping Address (black) */}
								<Collapse
									accordion
									defaultActiveKey={[]}
									style={{
										background: "#fff",
										marginTop: "10px",
									}}
								>
									{[...(selectedUser?.orders || [])]
										.sort((a, b) => {
											const aDate = new Date(
												a.createdAt?.toDate?.() ||
													a.createdAt ||
													0
											);
											const bDate = new Date(
												b.createdAt?.toDate?.() ||
													b.createdAt ||
													0
											);
											return (
												bDate.getTime() -
												aDate.getTime()
											);
										})
										.map((order: any, idx: number) => {
											const shippingAddr =
												order.shippingAddress ||
												order.address;
											const copyAddressText =
												formatAddressPlain(
													shippingAddr
												) ||
												formatAddressPlain(
													selectedUser?.profile?.[0]
												);

											return (
												<Collapse.Panel
													header={
														"Shipping Address for Order"
													}
													key={idx}
													style={{
														backgroundColor:
															"black",
													}}
												>
													{/* Shipping Address (black card) */}
													<Card
														size="small"
														style={{
															marginTop: 8,
															marginBottom: 12,
															background: "#000",
															color: "#fff",
															borderColor: "#333",
														}}
														bodyStyle={{
															color: "#fff",
															padding: 12,
														}}
													>
														<Space
															align="center"
															style={{
																width: "100%",
																justifyContent:
																	"space-between",
															}}
														>
															<Title
																level={5}
																style={{
																	color: "#fff",
																	margin: 0,
																}}
															>
																Shipping Address
															</Title>
															{copyAddressText && (
																<Tooltip title="Copy shipping address">
																	<Button
																		type="text"
																		size="small"
																		icon={
																			<CopyOutlined />
																		}
																		onClick={() =>
																			navigator.clipboard?.writeText(
																				copyAddressText
																			)
																		}
																		style={{
																			color: "#fff",
																		}}
																	/>
																</Tooltip>
															)}
														</Space>
														<div
															style={{
																marginTop: 8,
															}}
														>
															{renderAddressKV(
																shippingAddr ||
																	selectedUser
																		?.profile?.[0]
															)}
														</div>
													</Card>
												</Collapse.Panel>
											);
										})}
								</Collapse>
								{/* Status updater */}
								<div style={{ marginTop: 12 }}>
									<Space wrap>
										<Text strong>Update Status:</Text>
										<Select
											style={{ width: 200 }}
											value={order.status}
											onChange={(val) =>
												updateStatus(
													selectedUser.id,
													order.id,
													val as OrderStatus
												)
											}
										>
											<Option value="Processing your order">
												Processing
											</Option>
											<Option value="Packed">Packed</Option>
											<Option value="Shipped">Shipped</Option>
											<Option value="Delivered">
												Delivered
											</Option>
											<Option value="Cancelled">
												Cancelled
											</Option>
										</Select>
										{order.delhiveryWaybill ? (
											<>
												<Button type="primary" disabled>
													Created on Delhivery
												</Button>
												<Button
													onClick={() =>
														clearDelhiveryShipment(
															selectedUser.id,
															order.id
														)
													}
												>
													Create again
												</Button>
											</>
										) : (
											<Button
												type="primary"
												loading={
													creatingShipmentFor ===
													order.id
												}
												onClick={() =>
													createOnDelhivery(
														selectedUser.id,
														order.id
													)
												}
											>
												Create on Delhivery
											</Button>
										)}
									</Space>
								</div>
							</Card>
						);
					})}
			</Modal>

			<Modal
				title="Create shipment on Delhivery"
				open={Boolean(delhiveryConfirm)}
				onCancel={() => {
					if (creatingShipmentFor) return;
					setDelhiveryConfirm(null);
					setPinCheck({
						loading: false,
						serviceable: null,
						detail: "",
					});
				}}
				okText="Create"
				cancelText="Cancel"
				confirmLoading={Boolean(creatingShipmentFor) || pinCheck.loading}
				okButtonProps={{
					disabled: pinCheck.loading || pinCheck.serviceable === false,
				}}
				onOk={submitDelhiveryShipment}
				destroyOnClose
			>
				<p style={{ marginBottom: 12 }}>
					Select the pickup location, then create the forward shipment
					with this order’s customer and address details.
				</p>
				<p style={{ marginBottom: 12 }}>
					<Text type="secondary">Destination pincode: </Text>
					<Text strong>{delhiveryConfirm?.pincode || "N/A"}</Text>
				</p>
				{pinCheck.detail && (
					<Alert
						style={{ marginBottom: 12 }}
						type={
							pinCheck.loading
								? "info"
								: pinCheck.serviceable === false
									? "error"
									: pinCheck.serviceable === true
										? "success"
										: "warning"
						}
						showIcon
						message={pinCheck.detail}
					/>
				)}
				<Text strong style={{ display: "block", marginBottom: 8 }}>
					Pickup location
				</Text>
				<Select
					value={pickupLocation}
					onChange={(val) => setPickupLocation(val)}
					style={{ width: "100%" }}
					options={PICKUP_LOCATIONS.map((loc) => ({
						value: loc,
						label: loc,
					}))}
				/>
			</Modal>
		</div>
	);
}
