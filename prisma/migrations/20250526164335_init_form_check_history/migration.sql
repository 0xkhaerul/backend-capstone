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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_check_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "form_check_history" ADD CONSTRAINT "form_check_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
