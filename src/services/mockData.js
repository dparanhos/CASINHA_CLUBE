export const clientesMock = [
  { id: '00000000-0000-0000-0000-000000000001', nome_completo: 'Ana Silva',       cpf: 12345678900, email: 'ana.silva@email.com',   whatsapp: 11987654321, cep: 1310100, data_entrada: '2024-01-10T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000002', nome_completo: 'Bruno Costa',     cpf: 23456789011, email: 'bruno.costa@email.com',  whatsapp: 11912345678, cep: null,    data_entrada: '2024-01-15T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000003', nome_completo: 'Carla Mendes',    cpf: 34567890122, email: 'carla.m@email.com',       whatsapp: 21998765432, cep: 20040020, data_entrada: '2024-01-20T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000004', nome_completo: 'Diego Rocha',     cpf: 45678901233, email: 'diego.r@email.com',       whatsapp: 31976543210, cep: null,    data_entrada: '2024-02-01T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000005', nome_completo: 'Elena Ferreira',  cpf: 56789012344, email: 'elena.f@email.com',       whatsapp: 41965432109, cep: 80010010, data_entrada: '2024-02-10T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000006', nome_completo: 'Felipe Alves',    cpf: 67890123455, email: 'felipe.a@email.com',      whatsapp: 51954321098, cep: null,    data_entrada: '2024-02-15T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000007', nome_completo: 'Gabriela Lima',   cpf: 78901234566, email: 'gabi.lima@email.com',     whatsapp: 61943210987, cep: 70002900, data_entrada: '2024-02-20T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000008', nome_completo: 'Hugo Martins',    cpf: 89012345677, email: 'hugo.m@email.com',        whatsapp: 71932109876, cep: null,    data_entrada: '2024-03-01T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000009', nome_completo: 'Isabela Sousa',   cpf: 90123456788, email: 'isa.sousa@email.com',     whatsapp: 81921098765, cep: 50010040, data_entrada: '2024-03-10T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000010', nome_completo: 'João Pereira',    cpf:  1234567899, email: 'joao.p@email.com',        whatsapp: 91910987654, cep: null,    data_entrada: '2024-03-15T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000011', nome_completo: 'Karen Oliveira',  cpf: 11122233344, email: 'karen.o@email.com',       whatsapp: 11909876543, cep: 1310100, data_entrada: '2024-03-20T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000012', nome_completo: 'Lucas Barbosa',   cpf: 22233344455, email: 'lucas.b@email.com',       whatsapp: 21898765432, cep: null,    data_entrada: '2024-04-01T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000013', nome_completo: 'Marina Gomes',    cpf: 33344455566, email: 'marina.g@email.com',      whatsapp: 31887654321, cep: 30112010, data_entrada: '2024-04-05T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000014', nome_completo: 'Nelson Dias',     cpf: 44455566677, email: 'nelson.d@email.com',      whatsapp: 41876543210, cep: null,    data_entrada: '2024-04-10T00:00:00.000Z' },
  { id: '00000000-0000-0000-0000-000000000015', nome_completo: 'Olivia Santos',   cpf: 55566677788, email: 'olivia.s@email.com',      whatsapp: 51865432109, cep: 90010150, data_entrada: '2024-04-15T00:00:00.000Z' },
];

export const campanhasMock = [
  { Id: 1, nome: 'Verão 2024',           pontos: 150, descricao: 'Promoção especial de verão com pontos extras' },
  { Id: 2, nome: 'Aniversário do Clube', pontos: 100, descricao: 'Celebração do aniversário com pontos bônus' },
  { Id: 3, nome: 'Primavera Premiada',   pontos: 200, descricao: 'Pontos em dobro em todas as compras do mês' },
  { Id: 4, nome: 'Black Friday 2024',    pontos: 300, descricao: 'Pontos especiais na Black Friday' },
  { Id: 5, nome: 'Natal & Ano Novo',     pontos: 250, descricao: 'Pontos extra no fim de ano' },
  { Id: 6, nome: 'Carnaval 2025',        pontos: 180, descricao: 'Promoção de carnaval com pontos especiais' },
  { Id: 7, nome: 'Campanha de Março',    pontos: 120, descricao: 'Pontos progressivos em março' },
  { Id: 8, nome: 'Clube VIP Abril',      pontos: 400, descricao: 'Benefícios exclusivos para membros VIP' },
];

const now = new Date();
export const transacoesMock = [
  { id: '10000000-0000-0000-0000-000000000001', id_cliente: '00000000-0000-0000-0000-000000000003', tipo: 'Compra',  pontos: 150, total_compra: 250.00, detalhes: 'Compra na loja',    data_hora: new Date(now -  1*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000002', id_cliente: '00000000-0000-0000-0000-000000000001', tipo: 'Compra',  pontos: 120, total_compra: 180.50, detalhes: 'Compra online',      data_hora: new Date(now -  2*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000003', id_cliente: '00000000-0000-0000-0000-000000000007', tipo: 'Resgate', pontos:  90, total_compra:  90.00, detalhes: 'Resgate de pontos',  data_hora: new Date(now -  3*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000004', id_cliente: '00000000-0000-0000-0000-000000000002', tipo: 'Compra',  pontos: 200, total_compra: 320.00, detalhes: 'Compra na loja',    data_hora: new Date(now -  3*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000005', id_cliente: '00000000-0000-0000-0000-000000000005', tipo: 'Bônus',   pontos:  45, total_compra:  45.00, detalhes: 'Bônus indicação',   data_hora: new Date(now -  4*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000006', id_cliente: '00000000-0000-0000-0000-000000000001', tipo: 'Compra',  pontos: 100, total_compra: 150.00, detalhes: 'Compra online',      data_hora: new Date(now -  5*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000007', id_cliente: '00000000-0000-0000-0000-000000000004', tipo: 'Compra',  pontos: 140, total_compra: 210.00, detalhes: 'Compra na loja',    data_hora: new Date(now -  6*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000008', id_cliente: '00000000-0000-0000-0000-000000000008', tipo: 'Compra',  pontos:  50, total_compra:  75.00, detalhes: 'Compra online',      data_hora: new Date(now -  7*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000009', id_cliente: '00000000-0000-0000-0000-000000000003', tipo: 'Compra',  pontos: 250, total_compra: 400.00, detalhes: 'Compra na loja',    data_hora: new Date(now -  8*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000010', id_cliente: '00000000-0000-0000-0000-000000000011', tipo: 'Compra',  pontos:  85, total_compra: 125.00, detalhes: 'Compra online',      data_hora: new Date(now -  9*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000011', id_cliente: '00000000-0000-0000-0000-000000000006', tipo: 'Resgate', pontos:  60, total_compra:  60.00, detalhes: 'Resgate cashback',   data_hora: new Date(now - 10*86400000).toISOString() },
  { id: '10000000-0000-0000-0000-000000000012', id_cliente: '00000000-0000-0000-0000-000000000001', tipo: 'Compra',  pontos: 190, total_compra: 290.00, detalhes: 'Compra na loja',    data_hora: new Date(now - 11*86400000).toISOString() },
];
