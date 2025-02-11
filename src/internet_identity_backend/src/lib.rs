use ic_cdk::{export_candid, api};
#[ic_cdk::query]
fn greet(mut name: String) -> String {
    name.push_str(" := ");
    name.push_str(&api::caller().to_string());
    return name;
}
export_candid!();