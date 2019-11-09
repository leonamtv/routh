const express = require('express');
const cmd     = require('node-cmd');  
const router  = express.Router();

const regex_check_condition = /^\[((([-+]{0,1}[0-9])+)|([-+]{0,1}[0-9]\.[0-9]+)|( ))*\]$/;
const regex_check_brackets  = /^\[.+\]$/;





function filtrar_denominador ( denominador ) {

    
    // Verifica se o denominador passado está entre 
    // '[ ]', caso não esteja, ou tenha apenas um
    // aberto ou fechado, adiciona os colchetes. 
    if (!regex_check_brackets.test(denominador)) {
        denominador = denominador.replace('[', '');
        denominador = denominador.replace(']', '');
        denominador = '[' + denominador + ']';
    }

    // Verifica se o denominador está no padrão 
    // aceito: números inteiros ou de ponto flutu-
    // antes separados por espaço entre colchetes.
    if (!regex_check_condition.test(denominador)) {
        denominador = '';
    }

    return denominador;
}


router.post('/routh', (req, res) => {

    const { data } = req.body;

    console.log(data)

    let { denominador } = data;

    denominador = filtrar_denominador(denominador);

    if (denominador === '') 
        return res.json({ message : 'erro na passagem do denominador' });

    let command = `octave --eval "routh(${ denominador }, -1)"`;

    cmd.get(command, (err, data, std) => {
        console.log(data)
        
        if (err)
            return res.json({ message : 'erro', data: err });

        return res.json(JSON.parse(data));
    });

});

router.get('/routh-est', (req, res) => {

    const { data } = req.body;

    console.log(data)

    let { denominador } = data;

    denominador = filtrar_denominador(denominador);

    if (denominador === '') 
        return res.json({ message : 'erro na passagem do denominador' });

    let command = `octave --eval "routh(${ denominador }, 0)"`;

    cmd.get(command, (err, data, std) => {
        if (err)
            return res.json({ message : 'erro' });
        return res.json({ estavel : (data != '0') });
    });

});

router.get('/routh-neg-p', (req, res) => {

    const { data } = req.body;

    let { denominador } = data;

    denominador = filtrar_denominador(denominador);

    if (denominador === '') 
        return res.json({ message : 'erro na passagem do denominador' });

    let command = `octave --eval "routh(${ denominador }, 1)"`;

    cmd.get(command, (err, data, std) => {
        if (err)
            return res.json({ message : 'erro' });
        return res.json({ negp : data });
    })
});

router.get('/routh-pos-p', (req, res) => {
    
    const { data } = req.body;

    let { denominador } = data;

    denominador = filtrar_denominador(denominador);

    if (denominador === '') 
        return res.json({ message : 'erro na passagem do denominador' });

    let command = `octave --eval "routh(${ denominador }, 2)"`;

    cmd.get(command, (err, data, std) => {
        if (err)
            return res.json({ message : 'erro' });
        return res.json({ posp : data });
    })
});

router.get('/routh-zero-p', (req, res) => {

    const { data } = req.body;

    let { denominador } = data;

    denominador = filtrar_denominador(denominador);

    if (denominador === '') 
        return res.json({ message : 'erro na passagem do denominador' });

    let command = `octave --eval "routh(${ denominador }, 3)"`;

    cmd.get(command, (err, data, std) => {
        if (err)
            return res.json({ message : 'erro' });
        return res.json({ zerop : data });
    })
});

router.get('/routh-grid', (req, res) => {

    const { data } = req.body;

    let { denominador } = data;

    denominador = filtrar_denominador(denominador);

    if (denominador === '') 
        return res.json({ message : 'erro na passagem do denominador' });

    let command = `octave --eval "routh(${ denominador }, 4)"`;

    cmd.get(command, (err, data, std) => {
        if (err)
            return res.json({ message : 'erro' });
        return res.json({ grid : data });
    })
});

module.exports = router;
