-- CreateTable
CREATE TABLE "Socket" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,

    CONSTRAINT "Socket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Socket_userId_key" ON "Socket"("userId");
