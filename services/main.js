import { personagens } from "./data.js"

// ESTADO
let personagemCerto
personagemCerto = sortearPersonagem()

// ELEMENTOS
const input = document.getElementById("resposta")
const tentativasEl = document.getElementById("tentativas")
const resultadoEl = document.getElementById("resultado")
const datalist = document.getElementById("lista-personagens")
const btnReiniciar = document.getElementById("btn-reiniciar")

// FUNÇÕES
function sortearPersonagem() {
  let novo
  do {
    novo = personagens[Math.floor(Math.random() * personagens.length)]
  } while (novo.nome === personagemCerto?.nome)
  return novo
}

function formatar(valor) {
  return Array.isArray(valor) ? valor.join(" / ") : valor
}

function normalizar(valor) {
  return valor.toString().toLowerCase().trim()
}

function compararItem(item, listaCerta, acertouTudo) {
  if (acertouTudo) return "verde"

  const itemNorm = normalizar(item)
  const listaNorm = listaCerta.map(normalizar)

  return listaNorm.includes(itemNorm) ? "verde" : "vermelho"
}

// DATALIST DINÂMICO
input.addEventListener("input", () => {
  const texto = input.value.toLowerCase()
  datalist.innerHTML = ""

  if (texto.length === 0) return

  personagens
    .filter(p => p.nome.toLowerCase().includes(texto))
    .forEach(p => {
      const option = document.createElement("option")
      option.value = p.nome
      datalist.appendChild(option)
    })
})

// AO CHUTAR PERSONAGEM O DATALIST
input.addEventListener("change", () => {
  const nome = input.value.trim()

  const chutado = personagens.find(
    p => p.nome.toLowerCase() === nome.toLowerCase()
  )

  if (!chutado) return

  criarTentativa(chutado)

  if (chutado.nome === personagemCerto.nome) {
    resultadoEl.textContent = "🎉 Você acertou!"
    input.disabled = true
    btnReiniciar.style.display = "inline-block"
    return
  }

  input.value = ""
})

// CRIAR TENTATIVA
function criarTentativa(personagem) {
  const wrapper = document.createElement("div")
  wrapper.className = "tentativa"

  wrapper.innerHTML = `
    <h3 class="nome-personagem">${personagem.nome}</h3>
    <p class="frase-personagem">"${personagem.frase}"</p>

    ${criarCategoria("Estado", personagem.estado, personagemCerto.estado)}
    ${criarCategoria("Classe", personagem.classe, personagemCerto.classe)}
    ${criarCategoria("Grupo", personagem.grupo, personagemCerto.grupo)}
    ${criarCategoria("Ocupação", personagem.ocupacao, personagemCerto.ocupacao)}

    <hr />
  `

  tentativasEl.appendChild(wrapper)

  // AUTO SCROLL
  wrapper.scrollIntoView({
    behavior: "smooth",
    block: "center"
  })
}

// CRIAR CATEGORIA
function criarCategoria(titulo, valores, valoresCertos) {
  const lista = Array.isArray(valores) ? valores : [valores]
  const listaCerta = Array.isArray(valoresCertos) ? valoresCertos : [valoresCertos]

const listaNorm = lista.map(normalizar)
const listaCertaNorm = listaCerta.map(normalizar)

const acertouTudo =
  listaNorm.length === listaCertaNorm.length &&
  listaNorm.every(v => listaCertaNorm.includes(v))

  return `
    <div class="categoria">
      <span class="titulo-categoria">${titulo}</span>
      <div class="linha">
        ${lista
          .map(v => {
            const classe = compararItem(v, listaCerta, acertouTudo)
            return `<div class="bloquinho ${classe}">${v}</div>`
          })
          .join("")}
      </div>
    </div>
  `
}

// EVENTO DE JOGAR NOVAMENTE
btnReiniciar.addEventListener("click", () => {
  personagemCerto = sortearPersonagem()

  tentativasEl.innerHTML = ""
  resultadoEl.textContent = ""

  input.value = ""
  input.disabled = false
  input.focus()

  datalist.innerHTML = ""
  btnReiniciar.style.display = "none"
})