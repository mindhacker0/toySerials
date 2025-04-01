use bevy::prelude::*;
use wasm_cli::{setup,update_bloom_settings};

fn main() {
    App::new()
    .add_plugins(DefaultPlugins)
    .add_systems(Startup, setup)
    .add_systems(Update, update_bloom_settings)
    .run();
}