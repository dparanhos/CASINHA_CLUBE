CREATE TABLE [dbo].[campanhas] (
    [Id]     INT          IDENTITY (1, 1) NOT NULL,
    [pontos] INT          NOT NULL,
    [nome]   VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_campanhas] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO

