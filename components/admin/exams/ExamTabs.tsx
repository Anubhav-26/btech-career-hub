"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ExamTabsProps {
  exam: any;
}

export function ExamTabs({ exam }: ExamTabsProps) {
  const [overview, setOverview] = useState(exam.overview ?? "");
  const [eligibility, setEligibility] = useState(exam.eligibility ?? "");
  const [pattern, setPattern] = useState(exam.examPattern ?? "");
  const [syllabus, setSyllabus] = useState(exam.syllabus ?? "");

  async function handleSave() {
    alert(
      "Save action will be connected in the next step."
    );
  }

  return (
    <Tabs
      defaultValue="overview"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">

        <TabsList className="flex flex-wrap">

          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>

          <TabsTrigger value="eligibility">
            Eligibility
          </TabsTrigger>

          <TabsTrigger value="pattern">
            Pattern
          </TabsTrigger>

          <TabsTrigger value="syllabus">
            Syllabus
          </TabsTrigger>

          <TabsTrigger value="resources">
            Resources
          </TabsTrigger>

          <TabsTrigger value="pyqs">
            PYQs
          </TabsTrigger>

          <TabsTrigger value="cutoffs">
            Cutoffs
          </TabsTrigger>

          <TabsTrigger value="videos">
            Videos
          </TabsTrigger>

          <TabsTrigger value="faqs">
            FAQs
          </TabsTrigger>

        </TabsList>

        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>

      </div>

      {/* Overview */}

      <TabsContent value="overview">
        <Card>
          <CardContent className="p-6">

            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="min-h-[220px] w-full rounded-md border p-3"
            />

          </CardContent>
        </Card>
      </TabsContent>

      {/* Eligibility */}

      <TabsContent value="eligibility">
        <Card>
          <CardContent className="p-6">

            <textarea
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="min-h-[220px] w-full rounded-md border p-3"
            />

          </CardContent>
        </Card>
      </TabsContent>

      {/* Pattern */}

      <TabsContent value="pattern">
        <Card>
          <CardContent className="p-6">

            <textarea
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="min-h-[220px] w-full rounded-md border p-3"
            />

          </CardContent>
        </Card>
      </TabsContent>

      {/* Syllabus */}

      <TabsContent value="syllabus">
        <Card>
          <CardContent className="p-6">

            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="min-h-[220px] w-full rounded-md border p-3"
            />

          </CardContent>
        </Card>
      </TabsContent>

      {/* Resources */}

      <TabsContent value="resources">
        <Card>
          <CardContent className="p-6">

            <p className="text-muted-foreground">
              Resource CRUD will be added here.
            </p>

          </CardContent>
        </Card>
      </TabsContent>

      {/* PYQs */}

      <TabsContent value="pyqs">
        <Card>
          <CardContent className="p-6">

            <p className="text-muted-foreground">
              PYQ CRUD will be added here.
            </p>

          </CardContent>
        </Card>
      </TabsContent>

      {/* Cutoffs */}

      <TabsContent value="cutoffs">
        <Card>
          <CardContent className="p-6">

            <p className="text-muted-foreground">
              Cutoff CRUD will be added here.
            </p>

          </CardContent>
        </Card>
      </TabsContent>

      {/* Videos */}

      <TabsContent value="videos">
        <Card>
          <CardContent className="p-6">

            <p className="text-muted-foreground">
              Video CRUD will be added here.
            </p>

          </CardContent>
        </Card>
      </TabsContent>

      {/* FAQs */}

      <TabsContent value="faqs">
        <Card>
          <CardContent className="p-6">

            <p className="text-muted-foreground">
              FAQ CRUD will be added here.
            </p>

          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  );
}