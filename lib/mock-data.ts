export type OrderStatus =
  | "new"
  | "processing"
  | "in_transit"
  | "delivered"
  | "issue"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "partial";

export type TrackingEvent = {
  time: string;
  location: string;
  title: string;
  description: string;
  status: "done" | "current" | "pending" | "issue";
};

export type Order = {
  id: string;
  orderCode: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  originCountry: string;
  destinationCountry: string;
  serviceType: string;
  cargoType: string;
  packages: number;
  weightKg: number;
  shippingFee: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  note: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingTimeline: TrackingEvent[];
};

export const statusLabels: Record<OrderStatus, string> = {
  new: "Đơn mới",
  processing: "Đang xử lý",
  in_transit: "Đang vận chuyển",
  delivered: "Đã giao",
  issue: "Có sự cố",
  cancelled: "Đã hủy",
};

export const paymentLabels: Record<PaymentStatus, string> = {
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  partial: "Thanh toán một phần",
};

export const orders: Order[] = [
  {
    id: "ord-1001",
    orderCode: "DH-2505-1001",
    trackingCode: "VNUS879301",
    customerName: "Nguyễn Minh Anh",
    customerPhone: "0901 882 771",
    senderName: "Nguyễn Minh Anh",
    senderPhone: "0901 882 771",
    senderAddress: "Quận 3, TP. Hồ Chí Minh",
    receiverName: "Linh Nguyen",
    receiverPhone: "+1 408 555 0198",
    receiverAddress: "San Jose, California, United States",
    originCountry: "Việt Nam",
    destinationCountry: "United States",
    serviceType: "Express Air",
    cargoType: "Hồ sơ, quà tặng",
    packages: 2,
    weightKg: 5.8,
    shippingFee: 3450000,
    paymentStatus: "paid",
    status: "in_transit",
    note: "Khách yêu cầu báo trước khi giao.",
    createdAt: "2026-05-12",
    estimatedDelivery: "2026-05-18",
    trackingTimeline: [
      {
        time: "2026-05-12 09:20",
        location: "TP. Hồ Chí Minh",
        title: "Đã tạo vận đơn",
        description: "Đơn hàng được tiếp nhận tại quầy.",
        status: "done",
      },
      {
        time: "2026-05-13 15:40",
        location: "Kho Tân Sơn Nhất",
        title: "Đã xuất kho",
        description: "Hàng đã bàn giao cho hãng bay.",
        status: "done",
      },
      {
        time: "2026-05-14 06:10",
        location: "Hong Kong Hub",
        title: "Đang trung chuyển",
        description: "Kiện hàng đang được phân luồng sang tuyến Mỹ.",
        status: "current",
      },
      {
        time: "Dự kiến 2026-05-18",
        location: "San Jose, US",
        title: "Giao hàng",
        description: "Dự kiến giao đến người nhận.",
        status: "pending",
      },
    ],
  },
  {
    id: "ord-1002",
    orderCode: "DH-2505-1002",
    trackingCode: "VNJP550214",
    customerName: "Trần Quốc Bảo",
    customerPhone: "0938 224 556",
    senderName: "Bảo Logistics",
    senderPhone: "0938 224 556",
    senderAddress: "Cầu Giấy, Hà Nội",
    receiverName: "Takashi Sato",
    receiverPhone: "+81 80 1234 7788",
    receiverAddress: "Shinjuku, Tokyo, Japan",
    originCountry: "Việt Nam",
    destinationCountry: "Japan",
    serviceType: "Economy Air",
    cargoType: "Mỹ phẩm",
    packages: 1,
    weightKg: 3.2,
    shippingFee: 1850000,
    paymentStatus: "partial",
    status: "new",
    note: "Cần kiểm tra MSDS trước khi xuất.",
    createdAt: "2026-05-14",
    estimatedDelivery: "2026-05-21",
    trackingTimeline: [
      {
        time: "2026-05-14 10:05",
        location: "Hà Nội",
        title: "Đã tạo vận đơn",
        description: "Đơn mới chờ điều phối lấy hàng.",
        status: "current",
      },
    ],
  },
  {
    id: "ord-1003",
    orderCode: "DH-2505-1003",
    trackingCode: "VNAU449812",
    customerName: "Công ty An Khang",
    customerPhone: "028 7300 8866",
    senderName: "Kho An Khang",
    senderPhone: "0917 889 200",
    senderAddress: "Thủ Đức, TP. Hồ Chí Minh",
    receiverName: "Mia Tran",
    receiverPhone: "+61 412 555 019",
    receiverAddress: "Richmond, Victoria, Australia",
    originCountry: "Việt Nam",
    destinationCountry: "Australia",
    serviceType: "Commercial Cargo",
    cargoType: "Linh kiện điện tử",
    packages: 6,
    weightKg: 42,
    shippingFee: 12800000,
    paymentStatus: "unpaid",
    status: "processing",
    note: "Xuất hóa đơn VAT sau khi cân lại.",
    createdAt: "2026-05-13",
    estimatedDelivery: "2026-05-24",
    trackingTimeline: [
      {
        time: "2026-05-13 16:30",
        location: "TP. Hồ Chí Minh",
        title: "Đã nhận hàng",
        description: "Kiện hàng được đưa về kho khai thác.",
        status: "done",
      },
      {
        time: "2026-05-14 11:15",
        location: "Kho Thủ Đức",
        title: "Đang kiểm hàng",
        description: "Đội vận hành đang kiểm tra số kiện và chứng từ.",
        status: "current",
      },
    ],
  },
  {
    id: "ord-1004",
    orderCode: "DH-2505-1004",
    trackingCode: "VNDE773420",
    customerName: "Phạm Gia Hân",
    customerPhone: "0972 118 004",
    senderName: "Phạm Gia Hân",
    senderPhone: "0972 118 004",
    senderAddress: "Hải Châu, Đà Nẵng",
    receiverName: "Anna Pham",
    receiverPhone: "+49 30 555 0112",
    receiverAddress: "Mitte, Berlin, Germany",
    originCountry: "Việt Nam",
    destinationCountry: "Germany",
    serviceType: "Express Air",
    cargoType: "Thực phẩm khô",
    packages: 3,
    weightKg: 11.4,
    shippingFee: 5900000,
    paymentStatus: "paid",
    status: "issue",
    note: "Cần bổ sung mô tả thành phần thực phẩm.",
    createdAt: "2026-05-10",
    estimatedDelivery: "2026-05-19",
    trackingTimeline: [
      {
        time: "2026-05-10 08:45",
        location: "Đà Nẵng",
        title: "Đã nhận hàng",
        description: "Đơn được tiếp nhận từ khách hàng.",
        status: "done",
      },
      {
        time: "2026-05-12 13:10",
        location: "Kho Nội Bài",
        title: "Tạm giữ kiểm chứng từ",
        description: "Hàng cần bổ sung thông tin thành phần để khai báo.",
        status: "issue",
      },
    ],
  },
  {
    id: "ord-1005",
    orderCode: "DH-2505-1005",
    trackingCode: "VNSG663018",
    customerName: "Lê Thanh Tùng",
    customerPhone: "0909 332 180",
    senderName: "Tùng Store",
    senderPhone: "0909 332 180",
    senderAddress: "Quận 7, TP. Hồ Chí Minh",
    receiverName: "Darren Lee",
    receiverPhone: "+65 8123 4567",
    receiverAddress: "Tampines, Singapore",
    originCountry: "Việt Nam",
    destinationCountry: "Singapore",
    serviceType: "Same Week",
    cargoType: "Phụ kiện thời trang",
    packages: 4,
    weightKg: 9.6,
    shippingFee: 4200000,
    paymentStatus: "paid",
    status: "delivered",
    note: "Đã hoàn tất POD.",
    createdAt: "2026-05-07",
    estimatedDelivery: "2026-05-11",
    trackingTimeline: [
      {
        time: "2026-05-07 14:00",
        location: "TP. Hồ Chí Minh",
        title: "Đã nhận hàng",
        description: "Đơn được đưa vào tuyến Singapore.",
        status: "done",
      },
      {
        time: "2026-05-09 20:30",
        location: "Changi Hub",
        title: "Đã đến nước nhận",
        description: "Hàng hoàn tất nhập kho tại Singapore.",
        status: "done",
      },
      {
        time: "2026-05-11 10:15",
        location: "Tampines",
        title: "Đã giao hàng",
        description: "Người nhận đã ký xác nhận.",
        status: "done",
      },
    ],
  },
];

export const dashboardStats = {
  totalOrders: orders.length,
  newOrders: orders.filter((order) => order.status === "new").length,
  inTransit: orders.filter((order) => order.status === "in_transit").length,
  delivered: orders.filter((order) => order.status === "delivered").length,
  issues: orders.filter((order) => order.status === "issue").length,
  monthlyRevenue: orders.reduce((total, order) => total + order.shippingFee, 0),
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function findOrderById(id: string) {
  return orders.find((order) => order.id === id);
}

export function findOrderByTrackingCode(code: string) {
  return orders.find(
    (order) => order.trackingCode.toLowerCase() === code.trim().toLowerCase(),
  );
}
