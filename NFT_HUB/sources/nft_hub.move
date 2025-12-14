/*
/// Module: nft_hub
module nft_hub::nft_hub;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module nft_hub::nft_hub {

    use sui::display;
    use std::string::{Self, String};
    use sui::package::{Self, Publisher};

    public struct NFT_HUB has drop {}

    public struct Badge_NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: String,
        rarity: String,
        category: String,
    }

    fun init(otw: NFT_HUB, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        rarity: vector<u8>,
        category: vector<u8>,
        ctx: &mut TxContext

    ) {
        let badge = Badge_NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: string::utf8(url),
            rarity: string::utf8(rarity),
            category: string::utf8(category),
        };

        transfer::public_transfer(badge, tx_context::sender(ctx));

    }

public entry fun create_display(
    publisher: &Publisher,
    ctx: &mut TxContext
    ) {
    let mut display = display::new_with_fields<Badge_NFT>(
        publisher,
        vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"url"),
            string::utf8(b"rarity"),
            string::utf8(b"category"),
        ],
        vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"url"),
            string::utf8(b"rarity"),
            string::utf8(b"category"),
        ],
        ctx,
    );

    display::update_version(&mut display);
    transfer::public_transfer(display,
    tx_context::sender(ctx));
    }


}