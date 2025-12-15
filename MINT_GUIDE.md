# Guia: Criar e Mintar NFTs (Terminal + Sui CLI)

## 1. Publicar o módulo Move

```powershell
cd HUB_NFT
sui client publish --gas-budget 100000000
```

**Anota o Package ID que aparece no output.**

Vai ficar assim:
```
│ ├─ Package ID: 0x1a2b3c...
```

## 2. Criar Display (obrigatório uma vez)

```powershell
sui client call \
  --package <PACKAGE_ID> \
  --module nft_hub \
  --function create_display \
  --args <PUBLISHER_OBJECT_ID> \
  --gas-budget 50000000
```

**Como achar `PUBLISHER_OBJECT_ID`:**
- Apareceu no output do `sui client publish`
- Ou: `sui client objects | grep Publisher`

## 3. Mintar NFTs

```powershell
sui client call \
  --package <PACKAGE_ID> \
  --module nft_hub \
  --function mint \
  --args "NFT #1" "Badge raro" "https://image.url" "lendário" "badge" \
  --gas-budget 50000000
```

### Exemplo completo (copy-paste):

```powershell
# Substitui:
# <PACKAGE_ID> = o ID do seu package
# <ENDEREÇO> = seu endereço Sui (sui client active-address)

$PACKAGE = "0x1a2b3c..."
$ADDR = $(sui client active-address)

sui client call --package $PACKAGE --module nft_hub --function mint \
  --args "Raridade S" "NFT exclusivo" "https://example.com/nft1.png" "S" "badge" \
  --gas-budget 50000000

sui client call --package $PACKAGE --module nft_hub --function mint \
  --args "Raridade A" "NFT comum" "https://example.com/nft2.png" "A" "badge" \
  --gas-budget 50000000
```

## 4. Ver seus NFTs

```powershell
sui client objects --json | Select-String "Badge_NFT" -Context 5
```

Ou listar tudo:
```powershell
sui client objects
```

---

## Resumo

| Ação | Comando |
|------|---------|
| Publicar | `sui client publish --gas-budget 100000000` |
| Display | `sui client call --package <ID> --module nft_hub --function create_display --args <PUB_ID> --gas-budget 50000000` |
| Mintar | `sui client call --package <ID> --module nft_hub --function mint --args "nome" "desc" "url" "rarity" "category" --gas-budget 50000000` |
| Listar | `sui client objects` |

---

Pronto. Tudo na blockchain. Agora pro frontend.
