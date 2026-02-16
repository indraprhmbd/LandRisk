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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);
