from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Jogos simulados (somente CS)
proximos_jogos = {
    "cs": [
        {"adversario": "G2", "data": "2025-05-05", "horario": "18:00"},
        {"adversario": "NAVI", "data": "2025-05-10", "horario": "21:00"},
    ]
}

MENU = (
    "Eu sou o bot da FURIA! Posso te ajudar com:\n\n"
    "• Próximos jogos do time de CS\n"
    "• Jogadores do time de CS\n"
    "• História da FURIA\n"
    "• Títulos conquistados\n"
    "• Treinador (coach) do time de CS\n"
    "• Torcida\n"
    "• Atualizações recentes da organização\n\n"
)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    mensagem = data.get("message", "").lower().strip()

    if mensagem in ["", "ajuda", "menu", "assuntos", "sobre o que você fala", "opções"]:
        return jsonify({"reply": MENU})

    resposta = gerar_resposta(mensagem)
    return jsonify({"reply": resposta})

def gerar_resposta(mensagem):
    if "oi" in mensagem or "olá" in mensagem:
        return f"Fala, fã da FURIA!\n\n{MENU}"
    elif "jogo" in mensagem or "quando" in mensagem or "jogos" in mensagem:
        return listar_jogos("cs")
    elif "jogador" in mensagem or "jogadores" in mensagem:
        return (
            "Nosso time de CS conta com estrelas como KSCERATO, yuurih, YEKINDAR, molodoy e o lendário Professor FalleN! "
            "Uma equipe que representa o Brasil com garra e talento no CS:GO."
        )
    elif "história" in mensagem or "historia" in mensagem:
        return (
            "A FURIA Esports foi fundada em agosto de 2017 em Uberlândia, Minas Gerais, por Jaime Pádua, "
            "André Akkari e Cris Guedes. Desde então, tornou-se uma das principais organizações de esports do Brasil, "
            "com destaque no cenário internacional de CS:GO. Com um estilo de jogo agressivo e inovador, "
            "a FURIA conquistou fãs ao redor do mundo."
        )
    elif "valeu" in mensagem or "obrigado" in mensagem:
        return "Tamo junto! Qualquer coisa, chama de novo."
    elif "coach" in mensagem or "treinador" in mensagem:
        return (
            "O treinador atual da FURIA é Nicholas 'guerri' Nogueira, que lidera a equipe com maestria e dedicação."
        )
    elif "torcida" in mensagem or "fã" in mensagem:
        return (
            "A torcida da FURIA é conhecida como uma das mais apaixonadas do cenário brasileiro de CS:GO, "
            "sempre apoiando com muita energia e amor pelo time!"
        )
    elif "título" in mensagem or "conquistas" in mensagem:
        return (
            "A FURIA já conquistou títulos importantes como a ESL Pro League Season 12: North America e "
            "teve excelentes campanhas em torneios como o IEM Dallas e o IEM Rio Major, consolidando-se como uma potência no CS:GO."
        )
    elif "atualização" in mensagem or "novidade" in mensagem or " Atualizações" in mensagem:
        return (
            "Recentemente, a FURIA oficializou uma alteração em sua lineup de Counter-Strike 2 (CS2), movendo Felipe 'skullz' Medeiros ao banco de reservas. "
            "Para mais atualizações, acompanhe as redes sociais oficiais da FURIA."
        )
    else:
        return f"Não entendi muito bem.\n\n{MENU}"

def listar_jogos(modalidade):
    jogos = proximos_jogos.get(modalidade, [])
    if not jogos:
        return f"Nenhum jogo de {modalidade} marcado por enquanto. Fique ligado nas redes sociais da FURIA!"

    resposta = f"Próximos jogos da FURIA em {modalidade.title()}:\n"
    for jogo in jogos:
        resposta += f"- vs {jogo['adversario']} em {jogo['data']} às {jogo['horario']}\n"
    return resposta.strip()

if __name__ == "__main__":
    app.run(debug=True, port=8000)
