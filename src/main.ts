const sdk = require("@crypto-com/chain-jslib");
const { fromUint8Array } = require("js-base64");
const HDKey = sdk.HDKey;
const Secp256k1KeyPair = sdk.Secp256k1KeyPair;
const Units = sdk.Units;
const Big = sdk.utils.Big;

// Initialize the library configurations with TestNet configs
const cro = sdk.CroSDK({ network: sdk.CroNetwork.Testnet });

const importedHDKey = HDKey.fromMnemonic(
	"TODO fill me in with intended mnemonic"
);

// Derive a private key from an HDKey at the specified path
const privateKey = importedHDKey.derivePrivKey("m/44'/1'/0'/0/0");

// Getting a keyPair from a private key
const keyPair = Secp256k1KeyPair.fromPrivKey(privateKey);

// Init Raw transaction
const rawTx = new cro.RawTransaction();

const feeAmount = new cro.Coin("7500", Units.BASE);

// Custom properties set
rawTx.setMemo("Hello Test Memo");
rawTx.setGasLimit("280000");
rawTx.setFee(feeAmount);
rawTx.setTimeOutHeight("1777479"); // TODO change to a block  height in the future

const msgSend = new cro.bank.MsgSend({
	fromAddress: new cro.Address(keyPair).account(),
	toAddress: "tcro165tzcrh2yl83g8qeqxueg2g5gzgu57y3fe3kc3",  // TODO change to intended to_address
	amount: new cro.Coin("1210", Units.BASE)
});

const signableTx = rawTx
	.appendMessage(msgSend)
	.addSigner({
		publicKey: keyPair.getPubKey(),
		accountNumber: new Big(137),
		accountSequence: new Big(338) // TODO should be dynamic
	})
	.toSignable();

const signedTx = signableTx
	.setSignature(0, keyPair.sign(signableTx.toSignDoc(0)))
	.toSigned();

const tx_bytes = fromUint8Array(
	Uint8Array.from(Buffer.from(signedTx.getHexEncoded(), "hex"))
);
console.log(tx_bytes);

/*
THEN -
curl -X POST "https://testnet-croeseid.crypto.org:1317/txs/decode" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"tx\": \"TODO fill me in with the printed tx_bytes\"}"
*/
