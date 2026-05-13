"use client";

import { useState } from "react";
import {
  Droplets,
  Sparkles,
  Sun,
  FlaskConical,
  Archive,
  Hand,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

import { WHATSAPP_NUMERO } from "@/lib/constants";

const WHATSAPP_MENSAGEM = "Olá, gostaria de saber mais sobre as peças da DM Pratas!";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;

const careTips = [
  {
    icon: Droplets,
    title: "Evite Contato com Água",
    description:
      "Remova suas peças antes de tomar banho, nadar ou lavar as mãos. A água, especialmente com cloro ou sal, pode acelerar o processo de oxidação da prata.",
  },
  {
    icon: Sparkles,
    title: "Limpeza Regular",
    description:
      "Use um pano macio de flanela ou camurça para polir suas joias após o uso. Para limpezas mais profundas, utilize uma solução suave de água morna com sabão neutro.",
  },
  {
    icon: Sun,
    title: "Evite Exposição ao Sol",
    description:
      "A exposição prolongada ao sol e ao calor pode causar descoloração. Guarde suas peças em local fresco e seco quando não estiver usando.",
  },
  {
    icon: FlaskConical,
    title: "Produtos Químicos",
    description:
      "Perfumes, cremes, maquiagem e produtos de limpeza podem danificar a prata. Sempre coloque suas joias por último ao se arrumar e remova-as antes de usar produtos químicos.",
  },
  {
    icon: Archive,
    title: "Armazenamento Correto",
    description:
      "Guarde cada peça separadamente em saquinhos de veludo ou na caixa original para evitar arranhões e contato com o ar, que causa oxidação.",
  },
  {
    icon: Hand,
    title: "Manuseio com Cuidado",
    description:
      "Evite puxar ou dobrar correntes e peças delicadas. Ao colocar e retirar suas joias, faça-o com delicadeza para preservar os fechos e elos.",
  },
];

const cleaningSteps = [
  {
    step: 1,
    title: "Prepare a solução",
    description:
      "Misture água morna com algumas gotas de sabão neutro em um recipiente pequeno.",
  },
  {
    step: 2,
    title: "Mergulhe as peças",
    description:
      "Coloque suas joias na solução e deixe de molho por 5 a 10 minutos.",
  },
  {
    step: 3,
    title: "Escove suavemente",
    description:
      "Use uma escova de cerdas macias (como uma escova de dentes) para remover sujeiras nos detalhes.",
  },
  {
    step: 4,
    title: "Enxágue bem",
    description:
      "Lave as peças em água corrente limpa para remover todos os resíduos de sabão.",
  },
  {
    step: 5,
    title: "Seque completamente",
    description:
      "Seque cada peça com um pano macio de flanela. Certifique-se de que estejam totalmente secas antes de guardar.",
  },
];

const faqs = [
  {
    question: "Minha prata escureceu. É normal?",
    answer:
      "Sim, é completamente normal. A prata reage com o enxofre presente no ar, suor e outros elementos, causando oxidação. Isso pode ser facilmente revertido com uma limpeza adequada.",
  },
  {
    question: "Posso usar minhas joias na academia?",
    answer:
      "Não recomendamos. O suor, a umidade e o contato com equipamentos podem danificar suas peças e acelerar a oxidação.",
  },
  {
    question: "Como limpar prata em casa?",
    answer:
      "Siga o passo a passo acima: mergulhe em água morna com sabão neutro, escove suavemente com escova macia, enxágue e seque completamente com pano de flanela.",
  },
  {
    question: "Posso dormir com minhas joias?",
    answer:
      "Evite dormir com suas joias. Durante o sono, as peças podem se prender em tecidos, entortar ou sofrer pressão, além de acumular suor e oleosidade.",
  },
  {
    question: "Qual a diferença entre prata 925 e prata comum?",
    answer:
      "A prata 925 (ou prata de lei) contém 92,5% de prata pura e 7,5% de outros metais (geralmente cobre), o que garante maior durabilidade e brilho. A prata comum tem menor pureza e qualidade.",
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-title">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-tiffany transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-description">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function CuidadosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-tiffany-light px-5 py-12 text-center">
        <div className="mx-auto max-w-lg">
          <h1 className="font-heading text-3xl font-bold text-title">
            Guia de Cuidados
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-description">
            Suas joias de prata merecem atenção especial. Siga nossas
            recomendações para manter o brilho e a beleza das suas peças por
            muito mais tempo.
          </p>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-tiffany">
              Dicas Essenciais
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-title">
              Como Cuidar das Suas Joias
            </h2>
          </div>

          <div className="space-y-6">
            {careTips.map((tip) => (
              <div key={tip.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tiffany-light">
                  <tip.icon className="h-5 w-5 text-tiffany" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-title">
                    {tip.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-description">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-tiffany">
              Passo a Passo
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-title">
              Limpeza em Casa
            </h2>
          </div>

          <div className="space-y-6">
            {cleaningSteps.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tiffany text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-title">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-description">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-tiffany">
              Dúvidas Frequentes
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-title">
              Perguntas &amp; Respostas
            </h2>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white px-4">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12">
        <div className="mx-auto max-w-lg rounded-2xl bg-tiffany-light p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-title">
            Ainda tem dúvidas?
          </h2>
          <p className="mt-2 text-sm text-description">
            Entre em contato conosco pelo WhatsApp. Ficaremos felizes em ajudar!
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-tiffany px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-tiffany-dark"
          >
            <MessageCircle className="h-4 w-4" />
            Fale no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
