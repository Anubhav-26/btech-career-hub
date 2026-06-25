import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqAccordion({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  if (faqs.length === 0) return <p className="text-sm text-ink-muted">No FAQs yet for this exam.</p>;
  return (
    <Accordion type="single" collapsible>
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
