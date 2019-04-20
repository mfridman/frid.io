wasm_filename = "/wasm/main.wasm";	// set name of .wasm file

function load_wasm() {
    if (!WebAssembly.instantiateStreaming) { // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }

    const go = new Go();

    WebAssembly.instantiateStreaming(fetch(wasm_filename), go.importObject)
        .then(results => { go.run(results.instance); })
        .catch((err) => {
            console.error(err);
        });
}

load_wasm()