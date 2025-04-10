"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Country {
  id: string
  name: string
  devCount: number
  holidays: number
}

interface PTO {
  id: string
  countryId: string
  devName: string
  days: number
}

interface SprintData {
  countries: Country[]
  totalDays: number
  rollingAverageVelocity: number
  carryoverPoints: number
  ptoList: PTO[]
}

export default function SprintCalculator() {
  const [sprintData, setSprintData] = useState<SprintData>({
    countries: [
      { id: "1", name: "Colombia", devCount: 0, holidays: 0 },
      { id: "2", name: "Canada", devCount: 0, holidays: 0 },
      { id: "3", name: "US", devCount: 0, holidays: 0 },
    ],
    totalDays: 9,
    rollingAverageVelocity: 25,
    carryoverPoints: 0,
    ptoList: [],
  })

  const [results, setResults] = useState({
    devDaysByCountry: {} as Record<string, number>,
    totalDevDays: 0,
    fullCapacityDevDays: 0,
    capacity: 0,
    targetPoints: 0,
  })

  // Add a new country
  const addCountry = () => {
    const newCountry: Country = {
      id: Date.now().toString(),
      name: "",
      devCount: 0,
      holidays: 0,
    }
    setSprintData({
      ...sprintData,
      countries: [...sprintData.countries, newCountry],
    })
  }

  // Remove a country
  const removeCountry = (id: string) => {
    // Also remove any PTOs associated with this country
    const updatedPtoList = sprintData.ptoList.filter((pto) => pto.countryId !== id)

    setSprintData({
      ...sprintData,
      countries: sprintData.countries.filter((country) => country.id !== id),
      ptoList: updatedPtoList,
    })
  }

  // Update a country
  const updateCountry = (id: string, field: keyof Country, value: any) => {
    setSprintData({
      ...sprintData,
      countries: sprintData.countries.map((country) => (country.id === id ? { ...country, [field]: value } : country)),
    })
  }

  // Add a new PTO entry
  const addPTO = () => {
    // Only add PTO if there are countries
    if (sprintData.countries.length === 0) return

    const newPTO: PTO = {
      id: Date.now().toString(),
      countryId: sprintData.countries[0].id,
      devName: "",
      days: 0,
    }
    setSprintData({
      ...sprintData,
      ptoList: [...sprintData.ptoList, newPTO],
    })
  }

  // Remove a PTO entry
  const removePTO = (id: string) => {
    setSprintData({
      ...sprintData,
      ptoList: sprintData.ptoList.filter((pto) => pto.id !== id),
    })
  }

  // Update a PTO entry
  const updatePTO = (id: string, field: keyof PTO, value: any) => {
    setSprintData({
      ...sprintData,
      ptoList: sprintData.ptoList.map((pto) => (pto.id === id ? { ...pto, [field]: value } : pto)),
    })
  }

  // Handle input changes
  const handleInputChange = (field: keyof SprintData, value: number) => {
    // Use parseFloat for carryoverPoints, parseInt for others
    if (field === "carryoverPoints") {
      setSprintData({
        ...sprintData,
        [field]: value,
      });
    } else {
      setSprintData({
        ...sprintData,
        [field]: value,
      });
    }
  }

  // Reset all form fields to initial values
  const resetForm = () => {
    setSprintData({
      countries: [
        { id: "1", name: "Colombia", devCount: 0, holidays: 0 },
        { id: "2", name: "Canada", devCount: 0, holidays: 0 },
        { id: "3", name: "US", devCount: 0, holidays: 0 },
      ],
      totalDays: 9,
      rollingAverageVelocity: 25,
      carryoverPoints: 0,
      ptoList: [],
    })
  }

  // Calculate results
  useEffect(() => {
    // Calculate dev days by country
    const devDaysByCountry: Record<string, number> = {}
    let totalDevDays = 0
    let fullCapacityDevDays = 0

    sprintData.countries.forEach((country) => {
      // Calculate PTO days for this country
      const ptoDaysForCountry = sprintData.ptoList
        .filter((pto) => pto.countryId === country.id)
        .reduce((sum, pto) => sum + pto.days, 0)

      // Calculate dev days for this country
      const countryDevDays =
        country.devCount * sprintData.totalDays - ptoDaysForCountry - country.devCount * country.holidays

      devDaysByCountry[country.id] = countryDevDays
      totalDevDays += countryDevDays
      fullCapacityDevDays += country.devCount * sprintData.totalDays
    })

    // Calculate capacity percentage
    const capacity = fullCapacityDevDays > 0 ? totalDevDays / fullCapacityDevDays : 0

    // Calculate target points
    const targetPoints = sprintData.rollingAverageVelocity * capacity - sprintData.carryoverPoints

    setResults({
      devDaysByCountry,
      totalDevDays,
      fullCapacityDevDays,
      capacity,
      targetPoints,
    })
  }, [sprintData])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sprint Configuration</CardTitle>
              <CardDescription>Enter your team composition and sprint details</CardDescription>
            </div>
            <Button variant="outline" onClick={resetForm}>
              Reset All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalDays">Total Days for Development</Label>
            <Input
              id="totalDays"
              type="number"
              min="1"
              value={sprintData.totalDays || ""}
              onChange={(e) => handleInputChange("totalDays", Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Countries</h3>
              <Button variant="outline" size="sm" onClick={addCountry}>
                <Plus className="h-4 w-4 mr-2" />
                Add Country
              </Button>
            </div>

            {sprintData.countries.length === 0 && (
              <p className="text-sm text-muted-foreground">No countries added yet.</p>
            )}

            {sprintData.countries.map((country) => (
              <div key={country.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <Label htmlFor={`country-name-${country.id}`}>Country Name</Label>
                  <Input
                    id={`country-name-${country.id}`}
                    value={country.name}
                    onChange={(e) => updateCountry(country.id, "name", e.target.value)}
                    placeholder="Country name"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`dev-count-${country.id}`}>Dev Count</Label>
                  <Input
                    id={`dev-count-${country.id}`}
                    type="number"
                    min="0"
                    value={country.devCount || ""}
                    onChange={(e) => updateCountry(country.id, "devCount", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`holidays-${country.id}`}>Holidays</Label>
                  <Input
                    id={`holidays-${country.id}`}
                    type="number"
                    min="0"
                    value={country.holidays || ""}
                    onChange={(e) => updateCountry(country.id, "holidays", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCountry(country.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Developer PTO</h3>
              <Button variant="outline" size="sm" onClick={addPTO} disabled={sprintData.countries.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add PTO
              </Button>
            </div>

            {sprintData.ptoList.length === 0 && (
              <p className="text-sm text-muted-foreground">No PTO entries added yet.</p>
            )}

            {sprintData.ptoList.map((pto) => (
              <div key={pto.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4">
                  <Label htmlFor={`country-${pto.id}`}>Country</Label>
                  <select
                    id={`country-${pto.id}`}
                    value={pto.countryId}
                    onChange={(e) => updatePTO(pto.id, "countryId", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    {sprintData.countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4">
                  <Label htmlFor={`dev-${pto.id}`}>Developer</Label>
                  <Input
                    id={`dev-${pto.id}`}
                    value={pto.devName}
                    onChange={(e) => updatePTO(pto.id, "devName", e.target.value)}
                    placeholder="Dev name"
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`days-${pto.id}`}>PTO Days</Label>
                  <Input
                    id={`days-${pto.id}`}
                    type="number"
                    min="0"
                    value={pto.days || ""}
                    onChange={(e) => updatePTO(pto.id, "days", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-1">
                  <Button variant="ghost" size="icon" onClick={() => removePTO(pto.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rollingAverageVelocity">Rolling Average Velocity</Label>
              <Input
                id="rollingAverageVelocity"
                type="number"
                min="0"
                value={sprintData.rollingAverageVelocity || ""}
                onChange={(e) => handleInputChange("rollingAverageVelocity", Number.parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carryoverPoints">Carryover Points</Label>
              <Input
                id="carryoverPoints"
                type="number"
                min="0"
                step="0.1"  // Add step attribute to allow decimal increments
                value={sprintData.carryoverPoints || ""}
                onChange={(e) => handleInputChange("carryoverPoints", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Sprint Calculations</CardTitle>
          <CardDescription>Results based on your team configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Developer Days by Country</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sprintData.countries.map((country) => (
                <div key={country.id} className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{country.name} Dev Days</p>
                  <p className="text-2xl font-bold">{(results.devDaysByCountry[country.id] || 0).toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Total Dev Days</p>
                <p className="text-2xl font-bold">{results.totalDevDays.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Full Capacity Dev Days</p>
                <p className="text-2xl font-bold">{results.fullCapacityDevDays.toFixed(1)}</p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Team Capacity</p>
              <p className="text-2xl font-bold">{(results.capacity * 100).toFixed(1)}%</p>
              <div className="w-full bg-secondary mt-2 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${Math.min(results.capacity * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-6 bg-primary/10 rounded-lg border border-primary">
            <h3 className="text-lg font-medium mb-2">Target Points for Sprint</h3>
            <p className="text-4xl font-bold text-primary">{Math.max(0, Math.round(results.targetPoints))}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {sprintData.rollingAverageVelocity} velocity × {(results.capacity * 100).toFixed(1)}% capacity −{" "}
              {sprintData.carryoverPoints} carryover points
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


