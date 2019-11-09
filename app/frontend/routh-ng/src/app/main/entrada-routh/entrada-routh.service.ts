import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EntradaRouthService {
    // regexPattern = /^(([0-9]+|[0-9]+\/[0-9]+|[0-9]+(.|,)[0-9]+))( ([0-9]+|[0-9]+\/[0-9]+|[0-9]+(.|,)[0-9]+))*$/i;
    regexPattern = /^(\ *[-+]{0,1}[0-9]+[\.\/]{0,1}[0-9]*\ *)*$/i;

    api_url: string = 'http://localhost:3000'

    constructor(private httpClient : HttpClient) {

    }

    testaEquacao(params: {num : string[], den : string[]}) : Observable<any> {
        const { num, den } = params;

        return this.httpClient.post(`${this.api_url}/routh`, {
            data: {
                numerador: num.join(' '),
                denominador: den.join(' '),
            }
        });
    }

    /**
     * ENDPOINTS E INSTRUÇÕES:
     *  
     * numerador e denominador são aceitos 
     * se passados assim:
     * - "[ a_0 a_1 ... a_1 ]"
     * - "[a_0 a_1 ... a_1]"
     * - "[ a_0 a_1 ... a_1"
     * - "[a_0 a_1 ... a_1"
     * - "a_0 a_1 ... a_1 ]"
     * - "a_0 a_1 ... a_1]"
     * - "a_0 a_1 ... a_1"
     * 
     * onde a_i é um int ou um float
     * 
     * Estabilidade:
     * - url = /routh-est
     * - parametros = 
     *      request.body = {
     *          data: {
     *              numerador: <numerador>,
     *              denominador: <denominador>
     *          }
     *      }
     * - retorno = {
     *      estavel: <true|false>
     *   }
     * 
     * Número de pólos ao lado esquerdo
     * do eixo imaginário:
     * - url = /routh-neg-p
     * - parametros =       
     *      request.body = {
     *          data: {
     *              numerador: <numerador>,
     *              denominador: <denominador>
     *          }
     *      }
     * - retorno = {
     *       negp : <numero de polos a esquerda>
     *    }
     * 
     * Número de pólos ao lado direito
     * do eixo imaginário:
     * - url = /routh-pos-p
     * - parametros =       
     *      request.body = {
     *          data: {
     *              numerador: <numerador>,
     *              denominador: <denominador>
     *          }
     *      }
     * - retorno = {
     *       posp : <numero de polos a direita>
     *    }
     * 
     * Número de pólos zerados:
     * - url = /routh-zero-p
     * - parametros =       
     *      request.body = {
     *          data: {
     *              numerador: <numerador>,
     *              denominador: <denominador>
     *          }
     *      }
     * - retorno = {
     *       zerop : <numero de polos zerados>
     *    }
     * 
     * // PRECISA FAZER PARSING DO RETORNO
     * Retornar grid (tabela de routh) gerado:
     * - url = /routh-grid
     * - parametros =       
     *      request.body = {
     *          data: {
     *              numerador: <numerador>,
     *              denominador: <denominador>
     *          }
     *      }
     * - retorno = {
     *          grid : <string contendo o grid gerado>
     *     }
     */
}
