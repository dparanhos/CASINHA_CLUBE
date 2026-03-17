CREATE TABLE [dbo].[clientes] (
    [id]            UNIQUEIDENTIFIER CONSTRAINT [DEFAULT_clientes_Id] DEFAULT (newsequentialid()) NOT NULL,
    [nome_completo] NVARCHAR (MAX)   NOT NULL,
    [cpf]           BIGINT           NOT NULL,
    [email]         VARCHAR (MAX)    NULL,
    [whatsapp]      BIGINT           NOT NULL,
    [cep]           BIGINT           NULL,
    [data_entrada]  DATETIME         CONSTRAINT [DEFAULT_clientes_data_entrada] DEFAULT (getdate()) NOT NULL,
    CONSTRAINT [PK_clientes] PRIMARY KEY CLUSTERED ([id] ASC)
);


GO

