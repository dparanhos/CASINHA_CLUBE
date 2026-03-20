CREATE TABLE [dbo].[transacoes] (
    [id]           UNIQUEIDENTIFIER CONSTRAINT [DEFAULT_transacoes_id] DEFAULT (newsequentialid()) NOT NULL,
    [data_hora]    DATETIME         CONSTRAINT [DEFAULT_transacoes_data_hora] DEFAULT (getdate()) NOT NULL,
    [id_cliente]   UNIQUEIDENTIFIER NOT NULL,
    [tipo]         VARCHAR (50)     NOT NULL,
    [pontos]       BIGINT           NOT NULL,
    [total_compra] DECIMAL (18, 2)  NOT NULL,
    [detalhes]     NTEXT            NULL,
    CONSTRAINT [PK_transacoes] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_clientes_transacoes] FOREIGN KEY ([id_cliente]) REFERENCES [dbo].[clientes] ([id])
);


GO

