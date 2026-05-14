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
  ["Thung carton nho", 30000],
  ["Thung carton lon", 50000],
  ["Chi phi van hanh", 10000],
  ["Dong goi chong soc", 50000],
  ["Phi xu ly hang dac biet", 100000],
];
const paymentStatuses = ["PAID", "UNPAID", "PARTIAL", "PAID", "UNPAID"];
const goodsTypes = [
  "Documents and gifts",
  "Cosmetics",
  "Electronic components",
  "Dry food",
  "Fashion accessories",
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
