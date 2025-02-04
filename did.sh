cargo build --release --target wasm32-unknown-unknown --package internet_identity_backend

candid-extractor target/wasm32-unknown-unknown/release/internet_identity_backend.wasm >src/internet_identity_backend/internet_identity_backend.did