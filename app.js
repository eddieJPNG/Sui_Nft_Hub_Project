// RPC da Sui Testnet (gratuita e sem autenticação)
        const RPC_URL = "https://fullnode.testnet.sui.io";

        // Tenta carregar valores salvos
        window.addEventListener('load', () => {
            const savedOwner = localStorage.getItem('nft_owner');
            const savedPackage = localStorage.getItem('nft_package');
            
            if (savedOwner) document.getElementById('ownerAddress').value = savedOwner;
            if (savedPackage) document.getElementById('packageId').value = savedPackage;
        });

        function showStatus(message, type = 'info') {
            const statusEl = document.getElementById('status');
            statusEl.textContent = message;
            statusEl.className = `status show ${type}`;
        }

        async function fetchNFTs() {
            const owner = document.getElementById('ownerAddress').value.trim();
            const packageId = document.getElementById('packageId').value.trim();

            if (!owner || !packageId) {
                showStatus('❌ Preencha os campos de endereço e Package ID', 'error');
                return;
            }

            // Salva valores
            localStorage.setItem('nft_owner', owner);
            localStorage.setItem('nft_package', packageId);

            showStatus('<span class="loading-spinner"></span>Buscando NFTs...', 'loading');

            try {
                // Chamada RPC para buscar objetos do proprietário
                const response = await fetch(RPC_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: "suix_getOwnedObjects",
                        params: [
                            owner,
                            {
                                filter: {
                                    StructType: `${packageId}::nft_hub::Badge_NFT`
                                }
                            }
                        ]
                    })
                });

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error.message);
                }

                const nfts = data.result.data || [];

                if (nfts.length === 0) {
                    showStatus('⚠️ Nenhum NFT encontrado para este endereço', 'info');
                    renderEmpty();
                    return;
                }

                // Busca detalhes de cada NFT
                const nftDetails = await Promise.all(
                    nfts.map(nft => fetchObjectDetails(nft.data.objectId))
                );

                renderGallery(nftDetails.filter(nft => nft !== null));
                showStatus(`✅ Encontrados ${nftDetails.length} NFT(s)`, 'success');

            } catch (error) {
                console.error('Erro:', error);
                showStatus(`❌ Erro: ${error.message}`, 'error');
                renderError(error.message);
            }
        }

        async function fetchObjectDetails(objectId) {
            try {
                const response = await fetch(RPC_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: "sui_getObject",
                        params: [objectId, { showContent: true }]
                    })
                });

                const data = await response.json();

                if (data.error) {
                    console.error('Erro ao buscar objeto:', data.error);
                    return null;
                }

                const object = data.result;
                if (!object || !object.data || !object.data.content) {
                    return null;
                }

                const fields = object.data.content.fields;
                return {
                    objectId: objectId,
                    name: fields.name,
                    description: fields.description,
                    url: fields.url,
                    rarity: fields.rarity,
                    category: fields.category
                };

            } catch (error) {
                console.error('Erro ao buscar detalhes:', error);
                return null;
            }
        }

        function renderGallery(nfts) {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = nfts.map(nft => `
                <div class="nft-card">
                    <div class="nft-image">
                        ${nft.url ? `<img src="${nft.url}" alt="${nft.name}" onerror="this.style.display='none'">` : '🎭'}
                    </div>
                    <div class="nft-info">
                        <div class="nft-name">${escapeHtml(nft.name)}</div>
                        <div class="nft-description">${escapeHtml(nft.description)}</div>
                        <div class="nft-meta">
                            <span class="nft-badge">📊 ${escapeHtml(nft.rarity)}</span>
                            <span class="nft-badge">🏷️ ${escapeHtml(nft.category)}</span>
                        </div>
                        <div style="font-size: 0.75em; color: rgba(255,255,255,0.4); margin-top: 10px; word-break: break-all;">
                            ${nft.objectId.substring(0, 10)}...
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function renderEmpty() {
            document.getElementById('gallery').innerHTML = `
                <div class="empty" style="grid-column: 1 / -1;">
                    <div class="empty-icon">📭</div>
                    <p>Nenhum NFT encontrado</p>
                </div>
            `;
        }

        function renderError(message) {
            document.getElementById('gallery').innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1;">
                    ⚠️ ${escapeHtml(message)}
                </div>
            `;
        }

        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Enter para carregar
        document.getElementById('packageId').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') fetchNFTs();
        });