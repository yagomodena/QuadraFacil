export interface Proprietario {
    id: string;
    email: string;
    nome: string;
    nomeEstabelecimento: string;
    cidade: string;
    telefone: string;
    tipoPlano: string;
    quantidadeQuadras: number;
}

export interface Quadra {
    id: string;
    proprietarioId: string;
    nomeQuadra: string;
    tipoEsporte: string;
    precoHora: number;
    disponibilidade: string;
}

export interface Cliente {
    id: string;
    primeiroNome: string;
    sobrenome: string;
    email: string;
    telefone?: string;
}

export interface Reserva {
    id: string;
    proprietarioId: string;
    quadraId: string;
    quadraNome?: string; 
    clienteId?: string; 
    clienteNome?: string;
    dataHora: string; 
    status: 'pago' | 'pendente' | 'cancelado';
    tipoPagamento: string;
}
