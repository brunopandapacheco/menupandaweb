<StoreInfo
                telefone={configuracoes?.telefone || '(11) 99999-9999'}
                horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio || '08:00'}
                horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim || '18:00'}
                meiosPagamento={configuracoes?.meios_pagamento || ['Pix', 'Cardão', 'Dinheiro']}
                entrega={configuracoes?.entrega ?? true}
                taxaEntrega={configuracoes?.taxa_entrega || 0}
                emFerias={configuracoes?.em_ferias}
              />