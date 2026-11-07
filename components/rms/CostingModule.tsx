'use client'

import React, { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  Trash2,
  Edit2,
  History,
  Layers,
  ChefHat,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
  Building,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { RecipeItem, RecipeIngredient, InventoryItem, UserRole } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface CostingModuleProps {
  currentRole: UserRole
}

export function CostingModule({ currentRole }: CostingModuleProps) {
  const {
    recipes,
    inventory,
    operatingExpenses,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    addOperatingExpense,
    updateInventoryItem,
  } = useRestaurantDb()

  const { toast } = useToast()

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || '')
  const [activeTab, setActiveTab] = useState<'calculator' | 'all-recipes' | 'expenses' | 'variance'>('calculator')

  // Selected Recipe
  const activeRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0]

  // Recipe Builder / Edit Modal State
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null)

  // Builder Form State
  const [recipeForm, setRecipeForm] = useState<{
    name: string
    category: string
    servingSize: number
    laborCost: number
    overheadCost: number
    sellingPrice: number
    description: string
    image: string
    ingredients: { inventoryItemId: string; quantity: number }[]
  }>({
    name: '',
    category: 'Desserts',
    servingSize: 1,
    laborCost: 20,
    overheadCost: 15,
    sellingPrice: 200,
    description: '',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    ingredients: [
      { inventoryItemId: inventory[0]?.id || '', quantity: 100 },
    ],
  })

  // Simulated Ingredient Price Update Tester
  const [testPriceItemId, setTestPriceItemId] = useState<string>(inventory[0]?.id || '')
  const [testNewPrice, setTestNewPrice] = useState<number>(inventory[0]?.unitCost || 0.20)

  // Operating Expense Form State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState<{
    category: 'Labor' | 'Rent' | 'Utilities' | 'Maintenance' | 'Marketing' | 'Packaging & Sanitation'
    description: string
    amount: number
    frequency: 'Monthly' | 'Weekly' | 'Daily'
  }>({
    category: 'Utilities',
    description: 'Specialty Espresso Machine Maintenance & Filter Cartridge',
    amount: 12500,
    frequency: 'Monthly',
  })

  // Open modal for new recipe
  const handleOpenNewRecipe = () => {
    setEditingRecipeId(null)
    setRecipeForm({
      name: '',
      category: 'Desserts',
      servingSize: 1,
      laborCost: 25,
      overheadCost: 15,
      sellingPrice: 220,
      description: '',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
      ingredients: [
        { inventoryItemId: inventory[0]?.id || '', quantity: 100 },
      ],
    })
    setIsRecipeModalOpen(true)
  }

  // Open modal for editing
  const handleOpenEditRecipe = (r: RecipeItem) => {
    setEditingRecipeId(r.id)
    setRecipeForm({
      name: r.name,
      category: r.category,
      servingSize: r.servingSize,
      laborCost: r.laborCost,
      overheadCost: r.overheadCost,
      sellingPrice: r.currentSellingPrice,
      description: r.description,
      image: r.image,
      ingredients: r.ingredients.map((ing) => ({
        inventoryItemId: ing.inventoryItemId,
        quantity: ing.quantity,
      })),
    })
    setIsRecipeModalOpen(true)
  }

  // Calculate live ingredient costs for modal preview
  const liveIngredients = recipeForm.ingredients.map((ing) => {
    const inv = inventory.find((i) => i.id === ing.inventoryItemId)
    const unitCost = inv ? inv.unitCost : 0
    const lineCost = Number((ing.quantity * unitCost).toFixed(2))
    return {
      inventoryItemId: ing.inventoryItemId,
      ingredientName: inv?.name || 'Unknown Item',
      quantity: ing.quantity,
      unit: inv?.unit || 'g',
      unitCost,
      lineCost,
    }
  })

  const liveTotalIngredientCost = Number(liveIngredients.reduce((s, i) => s + i.lineCost, 0).toFixed(2))
  const liveProductionCost = Number((liveTotalIngredientCost + recipeForm.laborCost + recipeForm.overheadCost).toFixed(2))
  const liveCostPerServing = Number((liveProductionCost / (recipeForm.servingSize || 1)).toFixed(2))
  const liveGrossProfit = Number((recipeForm.sellingPrice - liveProductionCost).toFixed(2))
  const liveFoodCostPercent = recipeForm.sellingPrice > 0 ? Number(((liveTotalIngredientCost / recipeForm.sellingPrice) * 100).toFixed(2)) : 0
  const liveProfitMargin = recipeForm.sellingPrice > 0 ? Number(((liveGrossProfit / recipeForm.sellingPrice) * 100).toFixed(2)) : 0

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault()

    const recipePayload = {
      name: recipeForm.name,
      category: recipeForm.category,
      servingSize: recipeForm.servingSize,
      laborCost: recipeForm.laborCost,
      overheadCost: recipeForm.overheadCost,
      ingredients: liveIngredients,
      totalIngredientCost: liveTotalIngredientCost,
      totalProductionCost: liveProductionCost,
      suggestedSellingPrice: Math.round(liveTotalIngredientCost * 2.8),
      currentSellingPrice: recipeForm.sellingPrice,
      foodCostPercentage: liveFoodCostPercent,
      grossProfit: liveGrossProfit,
      profitMarginPercentage: liveProfitMargin,
      description: recipeForm.description,
      image: recipeForm.image,
    }

    if (editingRecipeId) {
      updateRecipe(editingRecipeId, recipePayload)
      toast('Recipe Updated', `Updated costing calculations for ${recipeForm.name}`, 'success')
    } else {
      const created = createRecipe(recipePayload)
      setSelectedRecipeId(created.id)
      toast('Recipe Created', `New recipe card ${recipeForm.name} saved with live inventory links`, 'success')
    }

    setIsRecipeModalOpen(false)
  }

  // Trigger simulated ingredient price shift
  const handleSimulatePriceShift = () => {
    const item = inventory.find((i) => i.id === testPriceItemId)
    if (!item) return

    updateInventoryItem(testPriceItemId, { unitCost: testNewPrice }, 'Cost Controller')
    toast(
      'Ingredient Cost Shifted',
      `Updated ${item.name} unit cost to ₱${testNewPrice}/${item.unit}. All linked recipe cards were automatically recalculated with historical logs preserved!`,
      'info'
    )
  }

  // Handle new expense
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault()
    addOperatingExpense({
      category: expenseForm.category,
      description: expenseForm.description,
      amount: expenseForm.amount,
      frequency: expenseForm.frequency,
      date: new Date().toISOString().substring(0, 10),
    })
    toast('Operating Expense Added', `Logged ₱${expenseForm.amount.toLocaleString()} under ${expenseForm.category}`, 'success')
    setIsExpenseModalOpen(false)
  }

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager'

  return (
    <div className="space-y-6">
      {/* Header Banner (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Recipe & Menu Costing Engine</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  PROFIT 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Dynamic ingredient yield costing, labor & overhead allocation, food cost % benchmark, and historical cost logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('variance')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-white hover:bg-[#FAF8F5] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <History className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Price Shift Simulator</span>
          </button>

          {isManagerOrAdmin && (
            <>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#60A5FA] hover:bg-[#3B82F6] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add OpEx</span>
              </button>

              <button
                onClick={handleOpenNewRecipe}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#22C55E] hover:bg-[#16A34A] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Recipe Card</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-black/10 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 font-black uppercase tracking-wider rounded-2xl border-2 border-black transition-all cursor-pointer ${
            activeTab === 'calculator' ? 'bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
          }`}
        >
          Recipe Cost Calculator (Mango Royale)
        </button>
        <button
          onClick={() => setActiveTab('all-recipes')}
          className={`px-4 py-2 font-black uppercase tracking-wider rounded-2xl border-2 border-black transition-all cursor-pointer ${
            activeTab === 'all-recipes' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
          }`}
        >
          All Recipes & Profitability ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 font-black uppercase tracking-wider rounded-2xl border-2 border-black transition-all cursor-pointer ${
            activeTab === 'expenses' ? 'bg-[#60A5FA] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
          }`}
        >
          Operating Expenses & Overheads
        </button>
        <button
          onClick={() => setActiveTab('variance')}
          className={`px-4 py-2 font-black uppercase tracking-wider rounded-2xl border-2 border-black transition-all cursor-pointer ${
            activeTab === 'variance' ? 'bg-[#C084FC] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
          }`}
        >
          Historical Price Shift & Variance
        </button>
      </div>

      {/* TAB 1: RECIPE COST CALCULATOR */}
      {activeTab === 'calculator' && activeRecipe && (
        <div className="space-y-6">
          {/* Recipe Selector Dropdown (Neo-Brutalist) */}
          <div className="flex items-center justify-between bg-white border-3 border-black p-4 rounded-3xl shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center gap-3">
              <span className="text-xs text-black font-black uppercase">Active Recipe:</span>
              <select
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                className="bg-[#FAF8F5] border-2 border-black rounded-2xl px-3 py-1.5 text-xs font-black text-black focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_#000]"
              >
                {recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.category} - Selling: ₱{r.currentSellingPrice})
                  </option>
                ))}
              </select>
            </div>

            {isManagerOrAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditRecipe(activeRecipe)}
                  className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#172033] flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Edit Recipe</span>
                </button>
              </div>
            )}
          </div>

          {/* Detailed Calculator Breakdown Card (Clean White Surfaces) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Ingredient Table & Yield (Glassmorphic + Rounded-3xl) */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3.5">
                  <img src={activeRecipe.image} alt={activeRecipe.name} className="w-16 h-16 rounded-2xl object-cover border border-[#E2E8F0]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-xl text-[#172033]">{activeRecipe.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200">
                        {activeRecipe.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 max-w-md">{activeRecipe.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#94A3B8]">Updated: {activeRecipe.updatedAt}</span>
                  <div className="text-sm font-bold text-[#172033] font-mono mt-1">
                    Serving: {activeRecipe.servingSize} portion
                  </div>
                </div>
              </div>

              {/* Exact Formula Table for Prompt Example (Mango Royale) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                    Inventory-Linked Ingredients Breakdown
                  </span>
                  <span className="text-[11px] text-[#64748B]">Dynamic real-time prices</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-mono text-[10px] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-3.5">Ingredient</th>
                        <th className="p-3.5 text-right">Quantity</th>
                        <th className="p-3.5 text-right">Unit Cost</th>
                        <th className="p-3.5 text-right">Total Line Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                      {activeRecipe.ingredients.map((ing, idx) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-3.5 font-bold text-[#172033]">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                              <span>{ing.ingredientName}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-right font-mono text-[#64748B]">
                            {ing.quantity} {ing.unit}
                          </td>
                          <td className="p-3.5 text-right font-mono text-[#64748B]">
                            ₱{ing.unitCost.toFixed(3)}/{ing.unit}
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-amber-700">
                            ₱{ing.lineCost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#F8FAFC] font-bold text-xs border-t border-[#E2E8F0]">
                      <tr>
                        <td colSpan={3} className="p-3.5 text-right text-[#64748B]">Total Raw Ingredient Cost:</td>
                        <td className="p-3.5 text-right text-[#172033] font-mono font-bold">
                          ₱{activeRecipe.totalIngredientCost.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Labor & Overhead Allocation */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>Allocated Kitchen Labor</span>
                    <ChefHat className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-lg font-bold font-mono text-[#172033] mt-1">
                    ₱{activeRecipe.laborCost.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Prep and plating time fraction</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span>Operating Overheads</span>
                    <Building className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold font-mono text-[#172033] mt-1">
                    ₱{activeRecipe.overheadCost.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Energy, rent & packaging</p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Financial Metrics & Margins (Clean White) */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <h4 className="font-bold text-sm text-[#172033] pb-3 border-b border-[#F1F5F9]">
                  Profitability & Pricing Summary
                </h4>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Raw Food Cost:</span>
                    <span className="font-mono font-bold text-[#172033]">₱{activeRecipe.totalIngredientCost.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Labor & Overheads:</span>
                    <span className="font-mono font-bold text-[#172033]">₱{(activeRecipe.laborCost + activeRecipe.overheadCost).toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                    <span className="font-bold text-[#172033]">Total Production Cost:</span>
                    <span className="font-mono font-bold text-base text-red-600">₱{activeRecipe.totalProductionCost.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Cost Per Serving:</span>
                    <span className="font-mono font-semibold text-[#172033]">
                      ₱{(activeRecipe.totalProductionCost / activeRecipe.servingSize).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Suggested Selling Price:</span>
                    <span className="font-mono text-emerald-600 font-semibold">₱{activeRecipe.suggestedSellingPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="font-bold text-sm text-[#172033]">Menu Selling Price:</span>
                    <span className="font-mono font-bold text-lg text-emerald-600">₱{activeRecipe.currentSellingPrice.toFixed(2)}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#172033]">Gross Profit Per Order:</span>
                      <span className="font-mono font-bold text-base text-[#EA580C]">
                        +₱{activeRecipe.grossProfit.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B]">Profit Margin:</span>
                      <span className="font-mono font-bold text-emerald-600">
                        {activeRecipe.profitMarginPercentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B]">Food Cost Percentage:</span>
                      <span className={`font-mono font-bold ${
                        activeRecipe.foodCostPercentage > 40 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {activeRecipe.foodCostPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Cost Adjustments for this recipe */}
              <div className="pt-3 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#172033] mb-2">
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  <span>Historical Cost Audit Records ({activeRecipe.historicalCostRecords.length})</span>
                </div>
                {activeRecipe.historicalCostRecords.length === 0 ? (
                  <p className="text-[11px] text-[#94A3B8]">No historical ingredient price changes yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {activeRecipe.historicalCostRecords.map((hist, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[10px]">
                        <div className="flex items-center justify-between text-[#64748B]">
                          <span>{hist.date}</span>
                          <span className="font-mono text-amber-700 font-bold">
                            ₱{hist.previousCost} → ₱{hist.newCost}
                          </span>
                        </div>
                        <p className="text-[#172033] mt-0.5">{hist.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL RECIPES LIST (Clean White) */}
      {activeTab === 'all-recipes' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="font-bold text-base text-[#172033]">Master Recipe & Menu Profitability Catalog</h3>
              <p className="text-xs text-[#64748B]">Comparison of production cost, menu price, and gross margin across categories.</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={handleOpenNewRecipe}
                className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold cursor-pointer"
              >
                + New Recipe
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#EA580C] hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#EA580C] border border-orange-200">
                      {r.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      Margin: {r.profitMarginPercentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2.5">
                    <img src={r.image} alt={r.name} className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0]" />
                    <div>
                      <h4 className="font-bold text-sm text-[#172033]">{r.name}</h4>
                      <p className="text-[11px] text-[#64748B] line-clamp-1">{r.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-center text-xs font-mono">
                    <div>
                      <p className="text-[9px] text-[#94A3B8]">Food Cost</p>
                      <p className="font-bold text-[#172033]">₱{r.totalIngredientCost}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#94A3B8]">Selling</p>
                      <p className="font-bold text-emerald-600">₱{r.currentSellingPrice}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[#94A3B8]">Profit</p>
                      <p className="font-bold text-[#EA580C]">₱{r.grossProfit}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      setSelectedRecipeId(r.id)
                      setActiveTab('calculator')
                    }}
                    className="text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
                  >
                    View Calculator →
                  </button>

                  {isManagerOrAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditRecipe(r)}
                        className="p-1 text-[#64748B] hover:text-[#172033] cursor-pointer"
                        title="Edit Recipe"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete recipe ${r.name}?`)) {
                            deleteRecipe(r.id)
                            toast('Recipe Deleted', `Removed ${r.name}`, 'info')
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete Recipe"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OPERATING EXPENSES (Clean White) */}
      {activeTab === 'expenses' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="font-bold text-base text-[#172033]">Operating Expense Allocation (OpEx)</h3>
              <p className="text-xs text-[#64748B]">Tracking fixed and overhead restaurant operational costs.</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold cursor-pointer"
              >
                + Log Expense
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {operatingExpenses.map((exp) => (
              <div key={exp.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#EA580C]">{exp.category}</span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{exp.frequency}</span>
                </div>
                <p className="font-bold text-sm text-[#172033]">{exp.description}</p>
                <p className="text-xl font-bold font-mono text-emerald-600 mt-2">
                  ₱{exp.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">Recorded: {exp.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HISTORICAL PRICE SHIFT SIMULATOR (Clean White) */}
      {activeTab === 'variance' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#F1F5F9]">
            <h3 className="font-bold text-base text-[#172033]">Interactive Ingredient Cost Shift Simulator</h3>
            <p className="text-xs text-[#64748B]">
              Demonstrating requirement: &ldquo;When ingredient prices change in the inventory, update recipe costing calculations while preserving historical cost records.&rdquo;
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Select Inventory Ingredient to Adjust</label>
              <select
                value={testPriceItemId}
                onChange={(e) => {
                  setTestPriceItemId(e.target.value)
                  const item = inventory.find((i) => i.id === e.target.value)
                  if (item) setTestNewPrice(item.unitCost)
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#172033]"
              >
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} (Current unit cost: ₱{inv.unitCost}/{inv.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">New Unit Cost (₱)</label>
              <input
                type="number"
                step="0.001"
                value={testNewPrice}
                onChange={(e) => setTestNewPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono font-bold text-emerald-600"
              />
            </div>

            <button
              onClick={handleSimulatePriceShift}
              className="w-full py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Apply Price Update & Recalculate Linked Recipes</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT RECIPE (Clean White) */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-base text-[#172033]">
                {editingRecipeId ? 'Edit Recipe Costing Card' : 'Create New Menu Item Recipe'}
              </h3>
              <button onClick={() => setIsRecipeModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveRecipe} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172033] mb-1">Recipe / Menu Item Name</label>
                  <input
                    type="text"
                    required
                    value={recipeForm.name}
                    onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172033] mb-1">Category</label>
                  <input
                    type="text"
                    value={recipeForm.category}
                    onChange={(e) => setRecipeForm({ ...recipeForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033]"
                  />
                </div>
              </div>

              {/* Ingredients List in Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#172033]">Recipe Ingredients (from Stock)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipeForm({
                        ...recipeForm,
                        ingredients: [...recipeForm.ingredients, { inventoryItemId: inventory[0]?.id || '', quantity: 50 }],
                      })
                    }}
                    className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Ingredient</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {recipeForm.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-xl border border-[#E2E8F0]">
                      <select
                        value={ing.inventoryItemId}
                        onChange={(e) => {
                          const updated = [...recipeForm.ingredients]
                          updated[idx].inventoryItemId = e.target.value
                          setRecipeForm({ ...recipeForm, ingredients: updated })
                        }}
                        className="flex-1 p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#172033] text-xs"
                      >
                        {inventory.map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.name} (₱{inv.unitCost}/{inv.unit})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Qty"
                        value={ing.quantity}
                        onChange={(e) => {
                          const updated = [...recipeForm.ingredients]
                          updated[idx].quantity = parseFloat(e.target.value) || 0
                          setRecipeForm({ ...recipeForm, ingredients: updated })
                        }}
                        className="w-20 p-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#172033] text-right"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setRecipeForm({
                            ...recipeForm,
                            ingredients: recipeForm.ingredients.filter((_, i) => i !== idx),
                          })
                        }}
                        className="text-red-500 p-1 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#172033] mb-1">Labor Cost (₱)</label>
                  <input
                    type="number"
                    value={recipeForm.laborCost}
                    onChange={(e) => setRecipeForm({ ...recipeForm, laborCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172033] mb-1">Overhead Cost (₱)</label>
                  <input
                    type="number"
                    value={recipeForm.overheadCost}
                    onChange={(e) => setRecipeForm({ ...recipeForm, overheadCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172033] mb-1">Selling Price (₱)</label>
                  <input
                    type="number"
                    value={recipeForm.sellingPrice}
                    onChange={(e) => setRecipeForm({ ...recipeForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-emerald-600 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Live Cost Preview Banner */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#94A3B8]">Ingredient Cost</span>
                  <p className="font-bold text-[#172033]">₱{liveTotalIngredientCost}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8]">Total Prod Cost</span>
                  <p className="font-bold text-red-600">₱{liveProductionCost}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8]">Gross Profit</span>
                  <p className="font-bold text-emerald-600">₱{liveGrossProfit}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8]">Food Cost %</span>
                  <p className="font-bold text-amber-700">{liveFoodCostPercent}%</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecipeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD OPERATING EXPENSE (Clean White) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-base text-[#172033]">Log Operating Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3.5">
              <div>
                <label className="block font-bold text-[#172033] mb-1">Expense Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033]"
                >
                  <option value="Labor">Labor</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Packaging & Sanitation">Packaging & Sanitation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#172033] mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172033] mb-1">Amount (₱)</label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-emerald-600 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172033] mb-1">Frequency</label>
                  <select
                    value={expenseForm.frequency}
                    onChange={(e) => setExpenseForm({ ...expenseForm, frequency: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
