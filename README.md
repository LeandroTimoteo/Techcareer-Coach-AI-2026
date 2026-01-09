# TechCareer Coach AI 🚀

Sua plataforma inteligente de mentoria de carreira para profissionais de tecnologia. 

## 🎯 Funcionalidades
- **CV Review**: Otimização técnica para sistemas ATS (filtros de RH).
- **LinkedIn Boost**: Melhore seu branding pessoal para atrair recrutadores.
- **Preparação de Entrevistas**: Simule perguntas reais (Método STAR).
- **Networking Estratégico**: Scripts de abordagem que funcionam.

## 💻 Como Rodar no VS Code

1. **Baixe ou Clone** este repositório.
2. Certifique-se de que o arquivo `.env.local` existe na raiz com sua chave:
   ```env
   API_KEY=AIzaSyBA0WjHT41zTGLD0eaibtdMAFV1PC-iozY
   ```
3. **Inicie o servidor**:
   - Se tiver a extensão **Live Server**, clique em "Go Live" no `index.html`.
   - Ou use o terminal: `npx serve .`

## 🌍 Como Subir para o Servidor (Vercel/Netlify)

1. **Suba para o GitHub**: O arquivo `.gitignore` já protege sua chave (ele ignora o `.env.local`).
2. **Configure no Servidor**:
   - No painel da Vercel/Netlify, vá em **Environment Variables**.
   - Adicione uma nova variável:
     - **Key:** `API_KEY`
     - **Value:** `AIzaSyBA0WjHT41zTGLD0eaibtdMAFV1PC-iozY`
3. O deploy será feito automaticamente e o site estará no ar!

---
**Dica de Ouro:** No GitHub, o seu código estará seguro. No servidor, a variável de ambiente garante que a IA funcione para seus usuários sem expor sua chave no código público.
