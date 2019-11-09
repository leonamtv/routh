import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { EntradaRouthService } from './entrada-routh.service';
import { tap, map, startWith, switchMap, distinctUntilChanged, debounceTime, filter, catchError, retry } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject, of, throwError } from 'rxjs';

@Component({
    selector: 'app-entrada-routh',
    templateUrl: './entrada-routh.component.html',
    styleUrls: ['./entrada-routh.component.scss']
})
export class EntradaRouthComponent {
    loading : boolean;

    equationExemplo: string = 'G(s) = \\frac{a_1s^n + a_2 s^{n-1} +' +  
                       '\\dots + a_n}{b_1s^m + b_2 s^{m-1} + \\dots + b_m}';

    numExemplo: string = 'a_1\\ a_2\\ \\dots\\ a_n';

    denExemplo: string = 'b_1\\ b_2\\ \\dots\\ b_m';

    coeficientes$ : Observable<{num , den}>;
    partesFracao$ : Observable<{num : string, den : string}>;
    equacao$ : Observable<string>;

    /**
     * status$.status:
     * 
     *  - empty: Estado inicial, nada foi inserido
     *  - changed: Entrada alterada e aguardando processamento
     *  - done: Entrada processada, e resultado disponível em 'status$.data'
     *  - error: Erro ao processar entrada, e detalhes disponiveis em 'status$.error'
     */
    status$ : BehaviorSubject<any>;

    form: FormGroup;

    constructor(
        private fb : FormBuilder,
        private service : EntradaRouthService
    ) {
        this.defineForm();
        this.defineInputStream();
        this.defineEquationStream();
    }

    defineForm() {
        this.form = this.fb.group({
            num: [
                "",
                Validators.pattern(this.service.regexPattern)
            ],
            den: [
                "",
                Validators.pattern(this.service.regexPattern)
            ],
        });       
    }

    defineInputStream() {
        this.status$ = new BehaviorSubject<any>( {status: 'empty'} );

        this.coeficientes$ = this.form.valueChanges.pipe(
            map(v => {
                if(this.form.valid) {
                    return {
                        num: v.num.trim().split(' ').filter(v => v != ''),
                        den: v.den.trim().split(' ').filter(v => v != '')
                    };
                }
                else {
                    return {
                        num: 'invalid',
                        den: 'invalid'
                    }
                }
            }),

            tap(() => this.status$.next( {status: 'changed'} )),
        );

        this.coeficientes$.pipe(
            filter(v => v.num != 'invalid' && v.den != 'invalid'),
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(
                /**
                 * Para tratar exceções de erros ocorridos na requisição,
                 * e não bloquear a chega de novos itens no stream
                 */
                v => of(v).pipe(
                    switchMap(v => this.service.testaEquacao(v)),
                    catchError(v => of({message: 'erro', data: v}))
                )
            ),

            tap(v => {
                if(v.message == 'erro')
                    this.status$.next( {status: 'error', data: v} )  
                else
                    this.status$.next( {status: 'done', data: v} ) 
            })

        ).subscribe();
    }

    defineEquationStream() {
        this.partesFracao$ = this.coeficientes$.pipe(
            map(v => {
                return {
                    num: this.vectorToStringEquation(v.num),
                    den: this.vectorToStringEquation(v.den)
                };
            }),
        );

        this.equacao$ = this.partesFracao$.pipe(
            startWith({num: null, den: null}),
            map( v => {
                if(v.num || v.den) {
                    if(v.num == 'invalid' || v.den == 'invalid') {
                        return `G(s) = \\text{Entrada inválida}`
                    } else {
                        return `G(s) = \\frac{ ${v.num} }{ ${v.den} }`
                    }
                }
                else {
                    return `G(s) = `
                }
            })
        );
    }

    vectorToStringEquation(v : string[] | string) {
        if(v == 'invalid')
            return 'invalid';

        let result : string = '';

        
        for ( let i = 0; i < v.length; i++ ) {

            if(!v[i].includes('-') && !v[i].includes('+') && i > 0 ) {
                result += '+';
            }

            result += v[i];

            if (v.length - i - 1 > 0) {
                result += (v.length - i - 1) != 1 ? 's^{' +  (v.length - i - 1) + '}' : 's';
            }
        }

        if(result == '')
            result = '';

        return result;
    }
}
