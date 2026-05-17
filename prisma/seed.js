const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const customers = [
  {
    customerCode: "CUS-0001",
    name: "Nguyen Minh Anh",
    phone: "0901 882 771",
    email: "minhanh@example.com",
    address: "Quan 3, TP. Ho Chi Minh",
  },
  {
    customerCode: "CUS-0002",
    name: "Tran Quoc Bao",
    phone: "0938 224 556",
    email: "quocbao@example.com",
    address: "Cau Giay, Ha Noi",
  },
  {
    customerCode: "CUS-0003",
    name: "Cong ty An Khang",
    phone: "028 7300 8866",
    email: "ops@ankhang.example",
    address: "Thu Duc, TP. Ho Chi Minh",
  },
  {
    customerCode: "CUS-0004",
    name: "Pham Gia Han",
    phone: "0972 118 004",
    email: "giahan@example.com",
    address: "Hai Chau, Da Nang",
  },
  {
    customerCode: "CUS-0005",
    name: "Le Thanh Tung",
    phone: "0909 332 180",
    email: "tungstore@example.com",
    address: "Quan 7, TP. Ho Chi Minh",
  },
];

const routes = [
  ["United States", "Linh Nguyen", "+1 408 555 0198", "San Jose, California, United States"],
  ["Japan", "Takashi Sato", "+81 80 1234 7788", "Shinjuku, Tokyo, Japan"],
  ["Australia", "Mia Tran", "+61 412 555 019", "Richmond, Victoria, Australia"],
  ["Germany", "Anna Pham", "+49 30 555 0112", "Mitte, Berlin, Germany"],
  ["Singapore", "Darren Lee", "+65 8123 4567", "Tampines, Singapore"],
];

const statuses = [
  "NEW",
  "CONFIRMED",
  "IN_WAREHOUSE",
  "PROCESSING",
  "IN_TRANSIT",
  "CUSTOMS_CLEARANCE",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "PROBLEM",
  "CANCELLED",
];

const serviceTypes = ["EXPRESS", "ECONOMY", "AIR", "SEA"];
const shippingServices = [
  {
    code: "EZW-AIR-US-PRI",
    name: "EZWAY Air US Priority",
    transportType: "AIR",
    destinationZone: "United States",
    description: "Tuyen air priority di My",
  },
  {
    code: "EZW-AIR-US-ECO",
    name: "EZWAY Air US Economy",
    transportType: "AIR",
    destinationZone: "United States",
    description: "Tuyen air economy di My",
  },
  {
    code: "EZW-SEA-US",
    name: "EZWAY Sea US",
    transportType: "SEA",
    destinationZone: "United States",
    description: "Tuyen sea di My",
  },
  {
    code: "EZW-SEA-CAD",
    name: "EZWAY Sea Canada",
    transportType: "SEA",
    destinationZone: "Canada",
    description: "Tuyen sea di Canada",
  },
  {
    code: "EZW-AIR-EU",
    name: "EZWAY Air Europe",
    transportType: "AIR",
    destinationZone: "Europe",
    description: "Tuyen air di Chau Au",
  },
];
const airUsPriorityCostRates = [
  ["0.5kg", 0, 0.5, "FIXED_TOTAL", 639655],
  ["1.0kg", 0.5, 1.0, "FIXED_TOTAL", 749877],
  ["2.0kg", 1.0, 2.0, "FIXED_TOTAL", 970300],
  ["19.5kg", 19.0, 19.5, "FIXED_TOTAL", 5032825],
  ["20.0kg", 19.5, 20.0, "FIXED_TOTAL", 5158040],
  ["20.5kg", 20.0, 20.5, "FIXED_TOTAL", 5283255],
  ["21-44kg", 20.5, 44, "PER_KG", 235000],
  ["45-99kg", 44, 99, "PER_KG", 235000],
  ["100-299kg", 99, 299, "PER_KG", 235000],
  ["300+kg", 299, null, "PER_KG", 235000],
];
const costItems = [
  ["Thùng carton nhỏ", 30000],
  ["Thùng carton lớn", 50000],
  ["Chi phí vận hành", 10000],
  ["Đóng gói chống sốc", 50000],
  ["Phí xử lý hàng đặc biệt", 100000],
];
const paymentStatuses = ["PAID", "UNPAID", "PARTIAL", "PAID", "UNPAID"];
const goodsTypes = [
  "Documents and gifts",
  "Cosmetics",
  "Electronic components",
  "Dry food",
  "Fashion accessories",
];

const drivers = [
  {
    driverCode: "DRV-260515-0001",
    name: "Nguyen Van Tai",
    phone: "0901 234 567",
    email: "tai.driver@ezway.vn",
    vehicleType: "MOTORBIKE",
    vehiclePlate: "59A1-12345",
    identityNumber: "123456789",
    isActive: true,
  },
  {
    driverCode: "DRV-260515-0002",
    name: "Tran Minh Phuc",
    phone: "0902 345 678",
    email: "phuc.driver@ezway.vn",
    vehicleType: "TRUCK",
    vehiclePlate: "51C-67890",
    identityNumber: "987654321",
    isActive: true,
  },
  {
    driverCode: "DRV-260515-0003",
    name: "Le Hoang Nam",
    phone: "0903 456 789",
    email: "nam.driver@ezway.vn",
    vehicleType: "VAN",
    vehiclePlate: "50H-24680",
    identityNumber: "456789123",
    isActive: true,
  },
];

const pickupStatuses = ["PENDING", "ASSIGNED", "ACCEPTED", "ON_THE_WAY", "ARRIVED", "PICKED_UP", "FAILED"];
const vehicleTypes = ["MOTORBIKE", "CAR", "VAN", "TRUCK"];

const pickupRequests = [
  {
    pickupCode: "PKP-260515-0001",
    senderName: "Nguyen Minh Anh",
    senderPhone: "0901 882 771",
    senderAddress: "123 Nguyen Trai, Quan 3, TP. Ho Chi Minh",
    senderWard: "Phuong 1",
    senderDistrict: "Quan 3",
    pickupDate: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 14),
    pickupTimeWindow: "14:00 - 17:00",
    vehicleType: "MOTORBIKE",
    estimatedPackageCount: 2,
    estimatedWeight: 5.5,
    goodsDescription: "Cosmetics and fashion accessories",
    pickupNote: "Call before arriving",
    status: "PENDING",
  },
  {
    pickupCode: "PKP-260515-0002",
    senderName: "Tran Quoc Bao",
    senderPhone: "0938 224 556",
    senderAddress: "456 Le Duan, Cau Giay, Ha Noi",
    senderWard: "Phuong Dich",
    senderDistrict: "Cau Giay",
    senderCity: "Ha Noi",
    pickupDate: addDays(new Date("2026-05-15T00:00:00.000Z"), 1, 10),
    pickupTimeWindow: "10:00 - 12:00",
    vehicleType: "VAN",
    estimatedPackageCount: 5,
    estimatedWeight: 15.0,
    goodsDescription: "Electronic components",
    status: "ASSIGNED",
    assignedAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 9),
  },
  {
    pickupCode: "PKP-260515-0003",
    senderName: "Pham Gia Han",
    senderPhone: "0972 118 004",
    senderAddress: "789 Tran Phu, Hai Chau, Da Nang",
    senderWard: "Thach Thang",
    senderDistrict: "Hai Chau",
    senderCity: "Da Nang",
    pickupDate: addDays(new Date("2026-05-15T00:00:00.000Z"), 2, 16),
    pickupTimeWindow: "16:00 - 18:00",
    vehicleType: "CAR",
    estimatedPackageCount: 1,
    estimatedWeight: 2.0,
    goodsDescription: "Documents",
    status: "ACCEPTED",
    assignedAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 1, 8),
    acceptedAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 1, 9),
  },
  {
    pickupCode: "PKP-260515-0004",
    senderName: "Le Thanh Tung",
    senderPhone: "0909 332 180",
    senderAddress: "321 Nguyen Thi Thap, Quan 7, TP. Ho Chi Minh",
    senderWard: "Tan Hung",
    senderDistrict: "Quan 7",
    pickupDate: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 11),
    pickupTimeWindow: "11:00 - 13:00",
    vehicleType: "TRUCK",
    estimatedPackageCount: 10,
    estimatedWeight: 50.0,
    goodsDescription: "Dry food products",
    status: "ON_THE_WAY",
    assignedAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 8),
    acceptedAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 9),
    onTheWayAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 10),
  },
  {
    pickupCode: "PKP-260515-0005",
    senderName: "Cong ty An Khang",
    senderPhone: "028 7300 8866",
    senderAddress: "654 Vo Van Ngan, Thu Duc, TP. Ho Chi Minh",
    senderWard: "Linh Chieu",
    senderDistrict: "Thu Duc",
    pickupDate: addDays(new Date("2026-05-14T00:00:00.000Z"), 0, 15),
    pickupTimeWindow: "15:00 - 17:00",
    vehicleType: "VAN",
    estimatedPackageCount: 3,
    estimatedWeight: 8.0,
    goodsDescription: "Fashion accessories",
    status: "ARRIVED",
    assignedAt: addDays(new Date("2026-05-14T00:00:00.000Z"), 0, 12),
    acceptedAt: addDays(new Date("2026-05-14T00:00:00.000Z"), 0, 13),
    onTheWayAt: addDays(new Date("2026-05-14T00:00:00.000Z"), 0, 14),
    arrivedAt: addDays(new Date("2026-05-14T00:00:00.000Z"), 0, 15),
  },
  {
    pickupCode: "PKP-260515-0006",
    senderName: "Nguyen Van Tai",
    senderPhone: "0901 234 567",
    senderAddress: "987 Pham Ngoc Thach, Quan 3, TP. Ho Chi Minh",
    senderWard: "Phuong 6",
    senderDistrict: "Quan 3",
    pickupDate: addDays(new Date("2026-05-13T00:00:00.000Z"), 0, 14),
    pickupTimeWindow: "14:00 - 16:00",
    vehicleType: "MOTORBIKE",
    estimatedPackageCount: 1,
    estimatedWeight: 1.5,
    goodsDescription: "Documents and gifts",
    status: "PICKED_UP",
    assignedAt: addDays(new Date("2026-05-13T00:00:00.000Z"), 0, 11),
    acceptedAt: addDays(new Date("2026-05-13T00:00:00.000Z"), 0, 12),
    onTheWayAt: addDays(new Date("2026-05-13T00:00:00.000Z"), 0, 13),
    arrivedAt: addDays(new Date("2026-05-13T00:00:00.000Z"), 0, 14),
    pickedUpAt: addDays(new Date("2026-05-13T00:00:00.000Z"), 0, 15),
    actualPackageCount: 1,
    actualWeight: 1.8,
  },
  {
    pickupCode: "PKP-260515-0007",
    senderName: "Tran Minh Phuc",
    senderPhone: "0902 345 678",
    senderAddress: "147 Nguyen Van Cu, Quan 5, TP. Ho Chi Minh",
    senderWard: "Phuong 4",
    senderDistrict: "Quan 5",
    pickupDate: addDays(new Date("2026-05-12T00:00:00.000Z"), 0, 9),
    pickupTimeWindow: "09:00 - 11:00",
    vehicleType: "TRUCK",
    estimatedPackageCount: 8,
    estimatedWeight: 35.0,
    goodsDescription: "Electronic components",
    status: "FAILED",
    assignedAt: addDays(new Date("2026-05-12T00:00:00.000Z"), 0, 8),
    acceptedAt: addDays(new Date("2026-05-12T00:00:00.000Z"), 0, 8),
    onTheWayAt: addDays(new Date("2026-05-12T00:00:00.000Z"), 0, 9),
    arrivedAt: addDays(new Date("2026-05-12T00:00:00.000Z"), 0, 9),
    failedAt: addDays(new Date("2026-05-12T00:00:00.000Z"), 0, 10),
    failedReason: "Customer not available at pickup location",
  },
  {
    pickupCode: "PKP-260515-0008",
    senderName: "Le Hoang Nam",
    senderPhone: "0903 456 789",
    senderAddress: "258 Tran Hung Dao, Quan 1, TP. Ho Chi Minh",
    senderWard: "Phuong Nguyen Thai Binh",
    senderDistrict: "Quan 1",
    pickupDate: addDays(new Date("2026-05-16T00:00:00.000Z"), 0, 13),
    pickupTimeWindow: "13:00 - 15:00",
    vehicleType: "VAN",
    estimatedPackageCount: 4,
    estimatedWeight: 12.0,
    goodsDescription: "Cosmetics",
    status: "PENDING",
  },
  {
    pickupCode: "PKP-260515-0009",
    senderName: "Pham Gia Han",
    senderPhone: "0972 118 004",
    senderAddress: "369 Le Loi, Hai Chau, Da Nang",
    senderWard: "Phuong Thach Thang",
    senderDistrict: "Hai Chau",
    senderCity: "Da Nang",
    pickupDate: addDays(new Date("2026-05-17T00:00:00.000Z"), 0, 10),
    pickupTimeWindow: "10:00 - 12:00",
    vehicleType: "CAR",
    estimatedPackageCount: 2,
    estimatedWeight: 4.0,
    goodsDescription: "Fashion accessories",
    status: "ASSIGNED",
    assignedAt: addDays(new Date("2026-05-15T00:00:00.000Z"), 0, 16),
  },
  {
    pickupCode: "PKP-260515-0010",
    senderName: "Cong ty An Khang",
    senderPhone: "028 7300 8866",
    senderAddress: "741 Vo Van Ngan, Thu Duc, TP. Ho Chi Minh",
    senderWard: "Phuong Linh Chieu",
    senderDistrict: "Thu Duc",
    pickupDate: addDays(new Date("2026-05-18T00:00:00.000Z"), 0, 14),
    pickupTimeWindow: "14:00 - 16:00",
    vehicleType: "TRUCK",
    estimatedPackageCount: 6,
    estimatedWeight: 25.0,
    goodsDescription: "Dry food",
    status: "ACCEPTED",
    assignedAt: addDays(new Date("2026-05-16T00:00:00.000Z"), 0, 9),
    acceptedAt: addDays(new Date("2026-05-16T00:00:00.000Z"), 0, 10),
  },
];

function addDays(baseDate, days, hour = 9) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function buildTrackingEvents(orderIndex, status) {
  const baseDate = addDays(new Date("2026-05-01T00:00:00.000Z"), orderIndex);
  const templates = [
    ["NEW", "Shipment order was created.", "Sales counter"],
    ["CONFIRMED", "Customer information and shipment details were confirmed.", "Operations desk"],
    ["IN_WAREHOUSE", "Cargo arrived at origin warehouse.", "Origin warehouse"],
    ["PROCESSING", "Cargo is being checked and prepared for export.", "Export warehouse"],
    ["IN_TRANSIT", "Cargo departed from origin country.", "International hub"],
    ["CUSTOMS_CLEARANCE", "Shipment is under customs clearance.", "Destination customs"],
    ["OUT_FOR_DELIVERY", "Shipment is out for final delivery.", "Local delivery station"],
    ["DELIVERED", "Shipment was delivered to the receiver.", "Receiver address"],
  ];

  if (status === "PROBLEM") {
    return [
      ...templates.slice(0, 3),
      ["PROBLEM", "Shipment needs additional documents before export.", "Export warehouse"],
    ].map(([eventStatus, message, location], index) => ({
      status: eventStatus,
      message,
      location,
      eventTime: addDays(baseDate, index, 9 + index),
    }));
  }

  if (status === "CANCELLED") {
    return [
      templates[0],
      ["CANCELLED", "Shipment was cancelled by request.", "Sales counter"],
    ].map(([eventStatus, message, location], index) => ({
      status: eventStatus,
      message,
      location,
      eventTime: addDays(baseDate, index, 9 + index),
    }));
  }

  const statusIndex = Math.max(
    0,
    templates.findIndex(([eventStatus]) => eventStatus === status),
  );
  const eventCount = Math.min(5, Math.max(2, statusIndex + 1));

  return templates.slice(0, eventCount).map(([eventStatus, message, location], index) => ({
    status: eventStatus,
    message,
    location,
    eventTime: addDays(baseDate, index, 9 + index),
  }));
}

function buildPackages(orderCode, count, orderIndex) {
  return Array.from({ length: count }, (_, packageIndex) => {
    const length = 28 + ((orderIndex + packageIndex) % 5) * 4;
    const width = 20 + ((orderIndex + packageIndex) % 4) * 3;
    const height = 12 + ((orderIndex + packageIndex) % 3) * 5;
    const actualWeight = Number((1.4 + ((orderIndex + packageIndex) % 6) * 0.85).toFixed(2));
    const volumetricWeight = Number(((length * width * height) / 5000).toFixed(2));
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    return {
      packageCode: `${orderCode}-PKG-${String(packageIndex + 1).padStart(2, "0")}`,
      length,
      width,
      height,
      actualWeight,
      volumetricWeight,
      chargeableWeight,
      description: packageIndex === 0 ? "Main parcel" : "Additional parcel",
    };
  });
}

async function main() {
  await prisma.payment.deleteMany();
  await prisma.orderExtraCost.deleteMany();
  await prisma.trackingEvent.deleteMany();
  await prisma.package.deleteMany();
  await prisma.order.deleteMany();
  await prisma.serviceCostRate.deleteMany();
  await prisma.costItem.deleteMany();
  await prisma.shippingService.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.pickupStatusLog.deleteMany();
  await prisma.pickupPhoto.deleteMany();
  await prisma.pickupRequest.deleteMany();
  await prisma.driver.deleteMany();

  const createdShippingServices = [];
  for (const shippingService of shippingServices) {
    createdShippingServices.push(await prisma.shippingService.create({ data: shippingService }));
  }
  const airUsPriority = createdShippingServices.find(
    (shippingService) => shippingService.code === "EZW-AIR-US-PRI",
  );

  if (airUsPriority) {
    for (let index = 0; index < airUsPriorityCostRates.length; index += 1) {
      const [label, minWeight, maxWeight, rateType, amount] = airUsPriorityCostRates[index];
      await prisma.serviceCostRate.create({
        data: {
          shippingServiceId: airUsPriority.id,
          label,
          minWeight,
          maxWeight,
          rateType,
          amount,
          currency: "VND",
          isActive: true,
          sortOrder: index + 1,
        },
      });
    }
  }

  for (const [name, defaultAmount] of costItems) {
    await prisma.costItem.create({
      data: {
        name,
        defaultAmount,
        isActive: true,
      },
    });
  }

  const createdCustomers = [];
  for (const customer of customers) {
    createdCustomers.push(await prisma.customer.create({ data: customer }));
  }

  for (let index = 0; index < 20; index += 1) {
    const orderCode = `DH-2605-${String(index + 1).padStart(4, "0")}`;
    const customer = createdCustomers[index % createdCustomers.length];
    const [destinationCountry, receiverName, receiverPhone, receiverAddress] =
      routes[index % routes.length];
    const status = statuses[index % statuses.length];
    const paymentStatus = paymentStatuses[index % paymentStatuses.length];
    const shippingService = createdShippingServices[index % createdShippingServices.length];
    const packageCount = 1 + (index % 4);
    const packages = buildPackages(orderCode, packageCount, index);
    const actualWeight = Number(packages.reduce((total, item) => total + item.actualWeight, 0).toFixed(2));
    const volumetricWeight = Number(
      packages.reduce((total, item) => total + item.volumetricWeight, 0).toFixed(2),
    );
    const chargeableWeight = Number(Math.max(actualWeight, volumetricWeight).toFixed(2));
    const baseFee = Math.round(chargeableWeight * 420000);
    const surchargeFee = index % 3 === 0 ? 250000 : 120000;
    const discountFee = index % 5 === 0 ? 150000 : 0;
    const totalFee = baseFee + surchargeFee - discountFee;
    const baseCost = Math.round(totalFee * 0.68);
    const extraCostTotal = 0;
    const profit = totalFee - baseCost - extraCostTotal;
    const paidAmount =
      paymentStatus === "PAID"
        ? totalFee
        : paymentStatus === "PARTIAL"
          ? Math.round(totalFee * 0.45)
          : 0;

    await prisma.order.create({
      data: {
        orderCode,
        trackingCode: `INTL${String(860000 + index * 37)}`,
        customerId: customer.id,
        shippingServiceId: shippingService.id,
        senderName: customer.name,
        senderPhone: customer.phone,
        senderAddress: customer.address || "Vietnam",
        receiverName,
        receiverPhone,
        receiverAddress,
        originCountry: "Vietnam",
        destinationCountry,
        serviceType: serviceTypes[index % serviceTypes.length],
        goodsType: goodsTypes[index % goodsTypes.length],
        packageCount,
        actualWeight,
        volumetricWeight,
        chargeableWeight,
        baseFee,
        surchargeFee,
        discountFee,
        totalFee,
        baseCost,
        extraCostTotal,
        profit,
        paymentStatus,
        status,
        internalNote: index % 4 === 0 ? "Check export documents before handover." : null,
        createdAt: addDays(new Date("2026-05-01T00:00:00.000Z"), index, 8),
        packages: {
          create: packages,
        },
        trackingEvents: {
          create: buildTrackingEvents(index, status),
        },
        payments:
          paidAmount > 0
            ? {
                create: {
                  amount: paidAmount,
                  method: index % 2 === 0 ? "Bank transfer" : "Cash",
                  note: paymentStatus === "PARTIAL" ? "Deposit payment" : "Full payment",
                  paidAt: addDays(new Date("2026-05-01T00:00:00.000Z"), index, 15),
                },
              }
            : undefined,
      },
    });
  }

  // Seed drivers
  const createdDrivers = [];
  for (const driver of drivers) {
    createdDrivers.push(await prisma.driver.create({ data: driver }));
  }

  // Seed pickup requests
  for (let index = 0; index < pickupRequests.length; index += 1) {
    const pickup = pickupRequests[index];
    const customer = createdCustomers.find(c => c.name === pickup.senderName);
    const driver = pickup.status !== "PENDING" ? createdDrivers[index % createdDrivers.length] : null;

    const pickupData = {
      ...pickup,
      customerId: customer ? customer.id : null,
      driverId: driver ? driver.id : null,
    };

    const createdPickup = await prisma.pickupRequest.create({ data: pickupData });

    // Create status log
    let logMessage = "";
    if (pickup.status === "PENDING") {
      logMessage = "Yêu cầu pickup đã được tạo";
    } else if (pickup.status === "ASSIGNED") {
      logMessage = `Admin đã phân tài xế ${driver.name}`;
    } else if (pickup.status === "ACCEPTED") {
      logMessage = "Tài xế đã nhận nhiệm vụ";
    } else if (pickup.status === "ON_THE_WAY") {
      logMessage = "Tài xế đang đi lấy hàng";
    } else if (pickup.status === "ARRIVED") {
      logMessage = "Tài xế đã tới điểm lấy hàng";
    } else if (pickup.status === "PICKED_UP") {
      logMessage = "Tài xế đã lấy hàng thành công";
    } else if (pickup.status === "FAILED") {
      logMessage = `Pickup thất bại: ${pickup.failedReason}`;
    }

    await prisma.pickupStatusLog.create({
      data: {
        pickupRequestId: createdPickup.id,
        status: pickup.status,
        message: logMessage,
      },
    });

    // Add some photos for completed pickups
    if (pickup.status === "PICKED_UP") {
      const photos = [
        {
          type: "GOODS",
          imageUrl: "https://example.com/photo1.jpg",
          caption: "Hàng hóa đã đóng gói",
        },
        {
          type: "PACKAGE",
          imageUrl: "https://example.com/photo2.jpg",
          caption: "Kiện hàng",
        },
        {
          type: "RECEIPT",
          imageUrl: "https://example.com/photo3.jpg",
          caption: "Biên nhận bàn giao",
        },
      ];

      for (const photo of photos) {
        await prisma.pickupPhoto.create({
          data: {
            pickupRequestId: createdPickup.id,
            ...photo,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
