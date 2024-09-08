-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "userArray" TEXT[],

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
