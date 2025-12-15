# NFT Hub - Implementação Minimalista

## O que você tem agora

### 1. **Move (Backend)**
Arquivo: `HUB_NFT/sources/hub_nft.move`

- Struct `Badge_NFT` com os campos do NFT
- Função `mint()` para criar NFTs via CLI
- Função `create_display()` para Setup do Display
- Tudo importado corretamente

**Status:** ✅ Pronto pra publicar

---

### 2. **CLI (Mint na mão)**
Arquivo: `MINT_GUIDE.md`

Passos:
```bash
# 1. Publica o módulo
sui client publish --gas-budget 100000000

# 2. Cria Display (uma vez)
sui client call --package <ID> --module nft_hub --function create_display ...

# 3. Minta NFTs (repete quantas vezes quiser)
sui client call --package <ID> --module nft_hub --function mint \
  --args "Nome" "Descrição" "URL" "Raridade" "Categoria" ...
```

**Status:** ✅ Documentado e pronto

---

### 3. **Frontend (Só lê)**
Arquivo: `index.html`

- HTML + CSS + JS puro
- Conecta na RPC pública (Testnet)
- Busca NFTs do seu endereço
- Renderiza a galeria
- **Zero wallet, zero assinatura, zero drama**

Basta abrir no navegador e entrar:
- Seu endereço Sui
- O Package ID (depois do mint)

**Status:** ✅ Pronto pro navegador

---

## Flow real (agora)

```
Terminal:
  1. sui client publish → cria Package ID
  2. sui client call --function mint → NFT na blockchain
  3. NFT já existe, visível pra todo mundo

Frontend:
  1. Abre index.html
  2. Cola endereço + Package ID
  3. Clica "Carregar"
  4. Mostra os NFTs
  5. Fim
```

---

## O que falta (depois)

- [ ] Múltiplas raridades / categorias (filtros)
- [ ] Paginação se tiver muitos NFTs
- [ ] Cache local pra não bater RPC toda hora
- [ ] Deploy num servidor estático (GitHub Pages, Vercel, etc)
- [ ] Wallet + Mint no frontend (muito depois)

---

## Como testar AGORA

1. **Sobe no Sui Testnet:**
   ```bash
   sui client switch --env testnet
   ```

2. **Pede gás (faucet):**
   ```bash
   sui client faucet
   ```

3. **Publica:**
   ```bash
   cd HUB_NFT
   sui client publish --gas-budget 100000000
   ```

4. **Copia o Package ID**

5. **Minta alguns NFTs:**
   ```bash
   sui client call --package 0x... --module nft_hub --function mint \
     --args "NFT #1" "Teste" "https://example.com/image.png" "raro" "teste" \
     --gas-budget 50000000
   ```

6. **Abre `index.html` no navegador**

7. **Cola seu endereço (sui client active-address) e Package ID**

8. **Clica "Carregar"**

9. **Vê os NFTs aparecendo**

---

## Arquitetura (a verdade nua)

```
Blockchain (Sui Testnet)
    ↓
    NFTs vivem aqui, imutáveis, públicos
    ↓
    RPC pública (sem autenticação)
    ↓
Frontend JS puro
    ↓
    Lê dados, renderiza HTML
    ↓
    Mostra pro usuário
```

Nada mais. Sem tokens. Sem carteira. Sem assinatura. Só dados lendo dados.

---

## Próximas features inteligentes

Quando isso tiver funcionando **100%**:

1. **Filtrar por rarity/category** → apenas selector change
2. **Buscar por nome** → input + filter JS
3. **Mostrar metadata completo** → modal ao clicar no NFT
4. **Guardar favoritos** → localStorage
5. **Conectar carteira** → só se quiser que o USUÁRIO minte (muito depois)

Tudo simples, tudo adicional. Nada obrigatório.

---

## TL;DR

✅ Move compila e publica  
✅ Mint via CLI (você controla)  
✅ Frontend lê e exibe (sem auth)  
✅ Pronto pra ir pro ar  

Sem hype. Sem glitter. Só código que funciona.
