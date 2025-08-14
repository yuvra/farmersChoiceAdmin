"use client";

import { useEffect, useState } from "react";
import { getDocs, updateDoc, doc, collection } from "firebase/firestore";
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
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

export default function OrdersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [cityFilter, setCityFilter] = useState<string | null>(null);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            const snap = await getDocs(
                collection(db, "userProfilesAndOrderStatus")
            );
            const userList = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
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
        newStatus: string
    ) => {
        const user = users.find((u) => u.id === userId);
        const updatedOrders = user.orders.map((order: any) =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        await updateDoc(doc(db, "userProfilesAndOrderStatus", userId), {
            orders: updatedOrders,
        });
        const updatedUser = { ...user, orders: updatedOrders };
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? updatedUser : u))
        );
        applyFilters(searchValue, statusFilter, cityFilter, [
            ...users.map((u) => (u.id === userId ? updatedUser : u)),
        ]);
        setSelectedUser(updatedUser);
    };

    const applyFilters = (
        search: string,
        status: string | null,
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
                user.orders?.some((order: any) => order.status === status)
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

    const handleStatusFilter = (value: string | null) => {
        setStatusFilter(value);
        applyFilters(searchValue, value, cityFilter);
    };

    const handleCityFilter = (value: string | null) => {
        setCityFilter(value);
        applyFilters(searchValue, statusFilter, value);
    };

    const getStatusTag = (status: string) => {
        const colorMap: Record<string, string> = {
            "Processing your order": "blue",
            Packed: "purple",
            Shipped: "orange",
            Delivered: "green",
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

    return (
        <div style={{ padding: "24px" }}>
            <Title level={3}>Customer Orders</Title>

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
                    style={{ width: 200 }}
                    onChange={(val) => handleStatusFilter(val || null)}
                >
                    <Option value="Processing your order">Processing</Option>
                    <Option value="Packed">Packed</Option>
                    <Option value="Shipped">Shipped</Option>
                    <Option value="Delivered">Delivered</Option>
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
                title={`Orders of ${selectedUser?.profile?.[0]?.name}`}
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                }}
                footer={null}
                width={800}
            >
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
                    .map((order: any, idx: number) => (
                        <Card
                            key={idx}
                            type="inner"
                            title={`Order ID: ${order.id}`}
                            style={{ marginBottom: 16 }}
                        >
                            Status: {getStatusTag(order.status)}
                            <p>Payment: {order.paymentMethod}</p>
                            <p>Amount: ₹{order.totalAmount}</p>
                            <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                                {order.items.map((item: any, i: number) => (
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
                                                        objectFit: "contain",
                                                        padding: 8,
                                                    }}
                                                />
                                            }
                                        >
                                            <Text strong>
                                                {item.product?.productName?.en}
                                            </Text>
                                            <p>
                                                Type:{" "}
                                                {item.product?.productType?.en}
                                            </p>
                                            <p>Qty: {item.quantity}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <div style={{ marginTop: 12 }}>
                                <Text strong>Update Status:</Text>
                                <Select
                                    style={{ marginLeft: 12, width: 180 }}
                                    value={order.status}
                                    onChange={(val) =>
                                        updateStatus(
                                            selectedUser.id,
                                            order.id,
                                            val
                                        )
                                    }
                                >
                                    <Option value="Processing your order">
                                        Processing
                                    </Option>
                                    <Option value="Packed">Packed</Option>
                                    <Option value="Shipped">Shipped</Option>
                                    <Option value="Delivered">Delivered</Option>
                                </Select>
                            </div>
                        </Card>
                    ))}
            </Modal>
        </div>
    );
}
