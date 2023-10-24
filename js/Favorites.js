import { GitHubUser } from "./GitHubuser.js";

//classes que vai conter a logica dos dados
//como os dados serão estruturados

export class Favorites{
    //nosso app (div id="app")
    constructor(root){
        this.root = document.querySelector(root)
        this.load() //carregar os dados 

        //Metodo estatico, uma promessa 
        GitHubUser.search('LeonardoAlbano').then(user => console.log(user))
    }

    load(){
        //transforma em um objeto
     this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
     
    }

    save() {
        //Transofrme em uma stringer no formato de JSON no localStorege
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }


    //codigo assincronos
    async add(username){
       
      try{

        const userExists = this.entries.find(entry => entry.login === username)

        if(userExists) {
            throw new Error('Usuário já cadastrado')
        }

        const user = await GitHubUser.search(username)

        if(user.login === undefined){
            throw new Error('Usuário não encontrado!')
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

    } catch(error){
        alert(error.menssage)
    }
      }  


    delete(user){

        //higher - order functions
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login) //remover elemento do array depois de carregar

       this.entries = filteredEntries
       this.update()
       this.save()
    }
}


//classe que vai criar a visualização
export class FavoritesView extends Favorites{
    //puxar todas as classes que tem no Favorites
    constructor(root){

        //vo super vai pra dentro do class Favorites 
        // PARA BUSCAR O THIS.ROOT QUE É O DOCUMENT.QUERRYSELECYTOR
        // VAI EXISTER PARA AS DUAS CLASSES TANTO PARA LÁ DE CIMA QUANTO PARA AQUI NA SUPER

        //Vai ser o construturir para o class Favorites(o de cima!!)
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    //Função update para alterar e mudar 
    // Chamada varias vezes para mudar algum dado
    
    update(){
        this.removeAlltr() //remover todos os tr's
    
    //pra cada usuário
    this.entries.forEach( user =>{
        const row = this.createRow()
        

        //Manipular a DOM
        //mudar o user img
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Image de ${user.name}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers

        row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar essa linha?')

            if(isOk){
                this.delete(user)
            }
        }


        //Elemento da DOM, html não puro
        this.tbody.append(row)
    })

    
    }

    createRow(){
        //preciso cirar um tr pela dom
        //criar um elemento html direto pelo JavaScrit
        //para criar as novas clinhas quando persquisar 
        const tr = document.createElement('tr')
        
        //conteudo que vai ser pego para recriar o novo
        //dados puxado do gitHub
        tr. innerHTML = `
        
            <td class="user">
                <img src="" alt="">
                <a href="" target="_blank">
                    <p>Mayk</p>
                    <span>maykebrito</span>
                </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td  class="remove">&times;</td>
        
        
        `

        //adicionar o conteudo criado como os dados 
        //do tr do html
       
        /*
            pode ser criado assim, porém para acessivilidade e clean code 
            colocar return tr 
           tr.innerHTML = contentInner
        */

        return tr
    }

    //Primeiro passo para remover as função
    //remover todos tr
    removeAlltr(){

        //Pegar todas a linhas do tr
        //Funcionalidade de array
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove() //primeiro passo é remover os elementos da funcionalidade
        });
    }
}