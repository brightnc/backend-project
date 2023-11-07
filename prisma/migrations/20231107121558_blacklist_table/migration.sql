-- CreateTable
CREATE TABLE "BlackListToken" (
    "token" VARCHAR(255) NOT NULL,
    "expire_epoch_timestamp" BIGINT NOT NULL,

    CONSTRAINT "BlackListToken_pkey" PRIMARY KEY ("token")
);
