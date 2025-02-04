use ic_cdk::{export_candid, api};
#[ic_cdk::query]
fn greet(_name: String) -> String {
    return api::caller().to_string();
}
export_candid!();