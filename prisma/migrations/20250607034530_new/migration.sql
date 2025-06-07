-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_check_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hypertension" BOOLEAN NOT NULL,
    "heartDisease" BOOLEAN NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "bloodGlucoseLevel" DOUBLE PRECISION NOT NULL,
    "hba1cLevel" DOUBLE PRECISION NOT NULL,
    "smokingHistory" VARCHAR(50) NOT NULL,
    "predictionResult" TEXT NOT NULL,
    "gender" VARCHAR(10),
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_check_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retina_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "predictedClass" TEXT NOT NULL,
    "confidenceClass" DOUBLE PRECISION NOT NULL,
    "savedStatus" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retina_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retina_history_guest" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "predictedClass" TEXT NOT NULL,
    "confidenceClass" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retina_history_guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_sliders" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_sliders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "form_check_history" ADD CONSTRAINT "form_check_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retina_history" ADD CONSTRAINT "retina_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
