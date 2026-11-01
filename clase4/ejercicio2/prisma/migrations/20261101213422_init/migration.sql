BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [username] VARCHAR(32) NOT NULL,
    [password] VARCHAR(64) NOT NULL,
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[Survey] (
    [id_suvey] INT NOT NULL IDENTITY(1,1),
    [title] VARCHAR(32) NOT NULL,
    [author] VARCHAR(32) NOT NULL,
    CONSTRAINT [Survey_pkey] PRIMARY KEY CLUSTERED ([id_suvey])
);

-- CreateTable
CREATE TABLE [dbo].[Question] (
    [id_question] INT NOT NULL IDENTITY(1,1),
    [label] VARCHAR(32) NOT NULL,
    [id_survey] INT NOT NULL,
    CONSTRAINT [Question_pkey] PRIMARY KEY CLUSTERED ([id_question])
);

-- CreateTable
CREATE TABLE [dbo].[Option] (
    [id_question] INT NOT NULL,
    [id_option] INT NOT NULL,
    [label] VARCHAR(32) NOT NULL,
    [votes] INT NOT NULL CONSTRAINT [Option_votes_df] DEFAULT 0,
    CONSTRAINT [Option_pkey] PRIMARY KEY CLUSTERED ([id_question],[id_option])
);

-- AddForeignKey
ALTER TABLE [dbo].[Survey] ADD CONSTRAINT [Survey_author_fkey] FOREIGN KEY ([author]) REFERENCES [dbo].[Account]([username]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Question] ADD CONSTRAINT [Question_id_survey_fkey] FOREIGN KEY ([id_survey]) REFERENCES [dbo].[Survey]([id_suvey]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Option] ADD CONSTRAINT [Option_id_question_fkey] FOREIGN KEY ([id_question]) REFERENCES [dbo].[Question]([id_question]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
