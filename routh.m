function result = routh (den)
  
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
                   grid(i - 2, j) * grid(i - 1, j + 1)) / ref;
    endfor
  endfor
  
  grid
  
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
  
endfunction