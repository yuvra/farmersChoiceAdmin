"use client";

import { useEffect, useMemo, useState } from "react";
import { getDocs, updateDoc, doc, collection } from "firebase/firestore";
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
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

type OrderStatus =
	| "Processing your order"
	| "Packed"
	| "Shipped"
	| "Delivered"
	| "Cancelled";

export default function OrdersPage() {
	const [users, setUsers] = useState<any[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
	const [cityFilter, setCityFilter] = useState<string | null>(null);

	// Fetch orders
	useEffect(() => {
		const fetchOrders = async () => {
			const snap = await getDocs(
				collection(db, "userProfilesAndOrderStatus")
			);
			const userList = snap.docs.map((d) => ({
				id: d.id,
				...d.data(),
			}));

			// Sort by latest order date
			userList.sort((a: any, b: any) => {
				const aDate = new Date(
					a.orders?.[a.orders.length - 1]?.createdAt?.toDate?.() ||
						a.orders?.[a.orders.length - 1]?.createdAt ||
						0
				);
				const bDate = new Date(
					b.orders?.[b.orders.length - 1]?.createdAt?.toDate?.() ||
						b.orders?.[b.orders.length - 1]?.createdAt ||
						0
				);
				return bDate.getTime() - aDate.getTime();
			});

			setUsers(userList);
			setFilteredUsers(userList);
		};

		fetchOrders();
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
		applyFilters(searchValue, statusFilter, cityFilter, nextUsers);
		setSelectedUser(updatedUser);
	};

	const applyFilters = (
		search: string,
		status: OrderStatus | null,
		city: string | null,
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

		setFilteredUsers(filtered);
	};

	const handleSearch = (value: string) => {
		setSearchValue(value);
		applyFilters(value, statusFilter, cityFilter);
	};

	const handleStatusFilter = (value: OrderStatus | null) => {
		setStatusFilter(value);
		applyFilters(searchValue, value, cityFilter);
	};

	const handleCityFilter = (value: string | null) => {
		setCityFilter(value);
		applyFilters(searchValue, statusFilter, value);
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
			addr?.name,
			addr?.flat,
			addr?.street,
			addr?.phone,
			addr?.landmark,
			addr?.city,
			addr?.district,
			addr?.pincode,
			addr?.state,
			addr?.country,
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
				{fields
					.filter((f) => f.value)
					.map((f) => (
						<Descriptions.Item key={f.key} label={f.label}>
							{f.value}
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
					.sort((a, b) => {
						const aDate = new Date(
							a.createdAt?.toDate?.() || a.createdAt || 0
						);
						const bDate = new Date(
							b.createdAt?.toDate?.() || b.createdAt || 0
						);
						return bDate.getTime() - aDate.getTime();
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
									Status:{" "}
									{getStatusTag(order.status as OrderStatus)}
								</p>
								<p>Payment: {order.paymentMethod}</p>
								<p>Amount: ₹{order.totalAmount}</p>
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
									<Text strong>Update Status:</Text>
									<Select
										style={{ marginLeft: 12, width: 200 }}
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
								</div>
							</Card>
						);
					})}
			</Modal>
		</div>
	);
}
