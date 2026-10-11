export default {
    fetch() {
        return Response.json(
            {
                ok: true,
                service: "rga-api",
                message: "API da Rádio Geração Ativa funcionando."
            },
            {
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        );
    }
};
