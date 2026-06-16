type NanoGptTemplateTarget = {
  suggestedModel: string;
  prompt: string;
};

export function getNanoGptGenerateUrl(template: NanoGptTemplateTarget, prompt = template.prompt) {
  const params = new URLSearchParams({
    mode: "image",
    model: template.suggestedModel,
    prompt,
  });

  return `https://nano-gpt.com/media?${params.toString()}`;
}
