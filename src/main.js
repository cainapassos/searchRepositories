import api from './api';

class App{

    constructor(){
        this.repositorios = [];
        this.formulario = document.querySelector('form');
        this.lista = document.querySelector('.list-group');
        this.registarEventos();
    }

    registarEventos(){
        this.formulario.onsubmit = evento => this.adicionarRepositorio(evento);
    }

    async adicionarRepositorio(evento){
        evento.preventDefault();

        let input = this.formulario.querySelector('input[id=repositorio]').value;

        if(input.length === 0){
            return;
        }

        this.apresentarBuscando();

        try{
            let response = await api.get(`/repos/${input}`);

            let { name, description, html_url, owner: { avatar_url } } = response.data;

            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url,
                link: html_url,
            });

            this.renderizarTela();
        }catch(erro){
            this.lista.removeChild(document.querySelector('.list-group-item-warning'));

            let er = this.lista.querySelector('.list-group-item-danger');
            if(er !== null){
                this.lista.removeChild(er);
            }

            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-danger');
            let txtErro = document.createTextNode(`O repositório ${input} não existe.`);
            li.appendChild(txtErro);
            this.lista.appendChild(li);
        }
    }

    apresentarBuscando(){
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item list-group-item-warning');
        let txtBuscando = document.createTextNode(`Aguarde, buscando o repositório...`);
        li.appendChild(txtBuscando);
        this.lista.appendChild(li);
    }

    renderizarTela(){
        this.lista.innerHTML = '';

        this.repositorios.forEach(repositorio => {

            let li = document.createElement('li');
            li.setAttribute('class', 'list-group-item list-group-item-action');

            let img = document.createElement('img');
            img.setAttribute('src', repositorio.avatar_url);
            li.appendChild(img);

            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);
            li.appendChild(strong);

            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao);
            p.appendChild(txtDescricao);
            li.appendChild(p);

            let a = document.createElement('a');
            a.setAttribute('target', '_blank');
            a.setAttribute('href', repositorio.link);
            let txtA = document.createTextNode('Acessar');
            a.appendChild(txtA);
            li.appendChild(a);

            this.lista.appendChild(li);

            this.formulario.querySelector('input[id=repositorio]').value = '';

            this.formulario.querySelector('input[id=repositorio]').focus();
        });
    }
}

new App();