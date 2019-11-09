function result = routh (den, config=5)
  % den = coeficientes do denominador da função   
  %       de transferência
  % config = inteiro que representa qual tipo de
  %          dado a função irá retornar:
  %      
  %  Se 0: 
  %   escreve um booleano dizendo se é estável ou
  %   não: 0 instável, 1 marginalmente estavel e
  %   2 estável
  %  Se 1:
  %   escreve o número de polos com a parte real
  %   negativa
  %  Se 2:
  %   escreve o número de polos com a parte real
  %   positiva
  %  Se 3:
  %   escreve o número de polos zerados
  %  Se 4:
  %   escreve a tabela gerada
  %  Se 5:
  %   escreve todas as opções acima
  clc;
  
  size_reference = max(size(den));

  grid = zeros(size_reference, size_reference - 1);
  
  j = 1;
  
  for i = 1:1:size(grid)(2)
    
    if ( j <= size_reference )
       grid(1, i) = den(j);
    endif
    
    if ( j < size_reference )
      grid(2, i) = den(j + 1);
    endif
    
    j = j + 2;
    
  endfor
  
  for i = 3:1:size(grid)(1)
    ref = grid(i - 1, 1);
    if (ref == 0)
      ref = 0.1;
    endif 
    for j = 1:1:size(grid)(2) - 1
      grid(i, j) = ( ref * grid(i - 2, j + 1) - ...
                   grid(i - 2, 1) * grid(i - 1, j + 1)) / ref;
    endfor
  endfor
  
  negative_count = 0;
  zero_count = 0;
  
  % se 0, ultimo sinal verificado é positivo
  % se 1, ultimo sinal verificado é negativo
  last_signal_state = 0;    
  signal_state = 0;
 
  % número de vezes que o sinal se alterou 
  % na primeira coluna da grid
  signal_change = 0;
  
  for i = 1:1:size(grid)(1)
   last_signal_state = signal_state;
    if (grid(i, 1) < 0)
      negative_count = negative_count + 1;
      signal_state = 1;
    elseif (grid(i, 1) == 0)
      zero_count = zero_count + 1;
      signal_state = 0;
    else
      signal_state = 0;
    endif
    
    if (last_signal_state != signal_state)
      signal_change = signal_change + 1;
    endif
    
  endfor
  
%  printf('Nº de negativos: %d\n', negative_count);
%  printf('Nº de zeros....: %d\n\n', zero_count);
%  
%  printf('Nº de polos no lado\ndireito do eixo im.: %d\n\n', signal_change);
%  
%  if (negative_count > 0)
%    printf('Sistema instável.\n');
%  else  
%    if ( zero_count > 0)
%      printf('Sistema marginalmente estável.\n');
%    else
%      printf('Sistema estável.\n');
%    endif
%  endif 



  if (negative_count > 0)
    # Sistema instável
    estabilidade = 0;
  else  
    if ( zero_count > 0)
      # Sistema marginalmente estável
      estabilidade = 1;
    else
      # Sistema estável
      estabilidade = 2  ;
    endif
  endif 
  
  if (config == -1)
    printf("{\n");

    printf('\t"estabilidade": %d,\n', estabilidade);
    printf('\t"negp": %d,\n', negative_count);
    printf('\t"posp": %d,\n', signal_change);
    printf('\t"zerop": %d,\n', zero_count);
    printf('\t"grid": [\n');

    for i = 1:1:size(grid)(1)
        printf('\t\t[')
        for j = 1:1:size(grid)(2)
            printf('%d', grid(i, j))

            if(j < size(grid, 2) )
                printf(',\t')
            endif;

        endfor


        if(i == size(grid, 1) )
            printf(']')
        else
            printf('],')
        endif;

        printf('\n');
    endfor


    printf('\t]\n')

    printf("}\n");
  elseif (config == 0)
    printf('%d', estabilidade)
  elseif (config == 1)
    printf('%d', negative_count);  
  elseif (config == 2)
    printf('%d', signal_change);
  elseif (config == 3)
    printf('%d', zero_count);
  elseif (config == 4)
    grid
  else
    grid
    printf('Nº de negativos: %d\n', negative_count);
    printf('Nº de zeros....: %d\n\n', zero_count);
    
    printf('Nº de polos no lado\ndireito do eixo im.: %d\n\n', signal_change);
    
    if (negative_count > 0)
      printf('Sistema instável.\n');
    else  
      if ( zero_count > 0)
        printf('Sistema marginalmente estável.\n');
      else
        printf('Sistema estável.\n');
      endif
    endif 
  endif
  
endfunction