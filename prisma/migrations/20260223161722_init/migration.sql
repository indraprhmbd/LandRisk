-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "kindeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "givenName" TEXT,
    "familyName" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "land_area" DOUBLE PRECISION NOT NULL,
    "zoning_category" TEXT NOT NULL,
    "soil_index" DOUBLE PRECISION NOT NULL,
    "flood_index" DOUBLE PRECISION NOT NULL,
    "environmental_index" DOUBLE PRECISION NOT NULL,
    "zoning_index" DOUBLE PRECISION NOT NULL,
    "topography_index" DOUBLE PRECISION NOT NULL,
    "data_completeness" DOUBLE PRECISION NOT NULL,
    "model_consistency" DOUBLE PRECISION NOT NULL,
    "data_recency" DOUBLE PRECISION NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "data_source_label" TEXT NOT NULL,
    "is_offline_mode" BOOLEAN NOT NULL DEFAULT false,
    "api_cache_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_kindeId_key" ON "User"("kindeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Parcel_latitude_longitude_idx" ON "Parcel"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Parcel_userId_idx" ON "Parcel"("userId");

-- AddForeignKey
ALTER TABLE "Parcel" ADD CONSTRAINT "Parcel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
