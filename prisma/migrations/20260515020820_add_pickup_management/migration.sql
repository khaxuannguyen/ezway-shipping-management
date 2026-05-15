-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "driverCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "vehicleType" TEXT NOT NULL,
    "vehiclePlate" TEXT,
    "identityNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PickupRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pickupCode" TEXT NOT NULL,
    "orderId" TEXT,
    "customerId" TEXT,
    "driverId" TEXT,
    "senderName" TEXT NOT NULL,
    "senderPhone" TEXT NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "senderWard" TEXT,
    "senderDistrict" TEXT,
    "senderCity" TEXT NOT NULL DEFAULT 'Ho Chi Minh City',
    "pickupLatitude" REAL,
    "pickupLongitude" REAL,
    "pickupDate" DATETIME NOT NULL,
    "pickupTimeWindow" TEXT,
    "vehicleType" TEXT NOT NULL,
    "estimatedPackageCount" INTEGER NOT NULL,
    "estimatedWeight" REAL,
    "actualPackageCount" INTEGER,
    "actualWeight" REAL,
    "goodsDescription" TEXT,
    "pickupNote" TEXT,
    "internalNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "failedReason" TEXT,
    "assignedAt" DATETIME,
    "acceptedAt" DATETIME,
    "onTheWayAt" DATETIME,
    "arrivedAt" DATETIME,
    "pickedUpAt" DATETIME,
    "failedAt" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PickupRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PickupRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PickupRequest_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PickupPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pickupRequestId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PickupPhoto_pickupRequestId_fkey" FOREIGN KEY ("pickupRequestId") REFERENCES "PickupRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PickupStatusLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pickupRequestId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "location" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PickupStatusLog_pickupRequestId_fkey" FOREIGN KEY ("pickupRequestId") REFERENCES "PickupRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverCode_key" ON "Driver"("driverCode");

-- CreateIndex
CREATE INDEX "Driver_isActive_idx" ON "Driver"("isActive");

-- CreateIndex
CREATE INDEX "Driver_vehicleType_idx" ON "Driver"("vehicleType");

-- CreateIndex
CREATE UNIQUE INDEX "PickupRequest_pickupCode_key" ON "PickupRequest"("pickupCode");

-- CreateIndex
CREATE UNIQUE INDEX "PickupRequest_orderId_key" ON "PickupRequest"("orderId");

-- CreateIndex
CREATE INDEX "PickupRequest_orderId_idx" ON "PickupRequest"("orderId");

-- CreateIndex
CREATE INDEX "PickupRequest_customerId_idx" ON "PickupRequest"("customerId");

-- CreateIndex
CREATE INDEX "PickupRequest_driverId_idx" ON "PickupRequest"("driverId");

-- CreateIndex
CREATE INDEX "PickupRequest_status_idx" ON "PickupRequest"("status");

-- CreateIndex
CREATE INDEX "PickupRequest_pickupDate_idx" ON "PickupRequest"("pickupDate");

-- CreateIndex
CREATE INDEX "PickupRequest_createdAt_idx" ON "PickupRequest"("createdAt");

-- CreateIndex
CREATE INDEX "PickupPhoto_pickupRequestId_idx" ON "PickupPhoto"("pickupRequestId");

-- CreateIndex
CREATE INDEX "PickupPhoto_type_idx" ON "PickupPhoto"("type");

-- CreateIndex
CREATE INDEX "PickupStatusLog_pickupRequestId_idx" ON "PickupStatusLog"("pickupRequestId");

-- CreateIndex
CREATE INDEX "PickupStatusLog_status_idx" ON "PickupStatusLog"("status");

-- CreateIndex
CREATE INDEX "PickupStatusLog_createdAt_idx" ON "PickupStatusLog"("createdAt");
