-- CreateTable
CREATE TABLE "ServiceCostRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shippingServiceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "minWeight" REAL NOT NULL,
    "maxWeight" REAL,
    "rateType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceCostRate_shippingServiceId_fkey" FOREIGN KEY ("shippingServiceId") REFERENCES "ShippingService" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "defaultAmount" REAL NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OrderExtraCost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "costItemId" TEXT,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrderExtraCost_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderExtraCost_costItemId_fkey" FOREIGN KEY ("costItemId") REFERENCES "CostItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderCode" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "shippingServiceId" TEXT,
    "senderName" TEXT NOT NULL,
    "senderPhone" TEXT NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "receiverAddress" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "goodsType" TEXT NOT NULL,
    "packageCount" INTEGER NOT NULL,
    "actualWeight" REAL NOT NULL,
    "volumetricWeight" REAL NOT NULL,
    "chargeableWeight" REAL NOT NULL,
    "baseFee" INTEGER NOT NULL,
    "surchargeFee" INTEGER NOT NULL,
    "discountFee" INTEGER NOT NULL,
    "totalFee" INTEGER NOT NULL,
    "baseCost" REAL NOT NULL DEFAULT 0,
    "extraCostTotal" REAL NOT NULL DEFAULT 0,
    "profit" REAL NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "internalNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_shippingServiceId_fkey" FOREIGN KEY ("shippingServiceId") REFERENCES "ShippingService" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("actualWeight", "baseFee", "chargeableWeight", "createdAt", "customerId", "destinationCountry", "discountFee", "goodsType", "id", "internalNote", "orderCode", "originCountry", "packageCount", "paymentStatus", "receiverAddress", "receiverName", "receiverPhone", "senderAddress", "senderName", "senderPhone", "serviceType", "shippingServiceId", "status", "surchargeFee", "totalFee", "trackingCode", "updatedAt", "volumetricWeight") SELECT "actualWeight", "baseFee", "chargeableWeight", "createdAt", "customerId", "destinationCountry", "discountFee", "goodsType", "id", "internalNote", "orderCode", "originCountry", "packageCount", "paymentStatus", "receiverAddress", "receiverName", "receiverPhone", "senderAddress", "senderName", "senderPhone", "serviceType", "shippingServiceId", "status", "surchargeFee", "totalFee", "trackingCode", "updatedAt", "volumetricWeight" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("orderCode");
CREATE UNIQUE INDEX "Order_trackingCode_key" ON "Order"("trackingCode");
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX "Order_shippingServiceId_idx" ON "Order"("shippingServiceId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ServiceCostRate_shippingServiceId_idx" ON "ServiceCostRate"("shippingServiceId");

-- CreateIndex
CREATE INDEX "ServiceCostRate_rateType_idx" ON "ServiceCostRate"("rateType");

-- CreateIndex
CREATE INDEX "ServiceCostRate_isActive_idx" ON "ServiceCostRate"("isActive");

-- CreateIndex
CREATE INDEX "ServiceCostRate_sortOrder_idx" ON "ServiceCostRate"("sortOrder");

-- CreateIndex
CREATE INDEX "CostItem_isActive_idx" ON "CostItem"("isActive");

-- CreateIndex
CREATE INDEX "OrderExtraCost_orderId_idx" ON "OrderExtraCost"("orderId");

-- CreateIndex
CREATE INDEX "OrderExtraCost_costItemId_idx" ON "OrderExtraCost"("costItemId");
