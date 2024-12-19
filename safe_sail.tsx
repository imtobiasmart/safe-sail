'use client'

import { useState } from 'react'
import { Bell, HelpCircle, ChevronUp, ArrowUp, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showRiskPreferences, setShowRiskPreferences] = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [selectedAction, setSelectedAction] = useState('')
  const [riskPreferences, setRiskPreferences] = useState({
    riskTolerance: '',
    alertThreshold: 1000,
    movementsToMonitor: [],
    alertFrequency: '',
    assetPreference: []
  })

  const router = useRouter()

  const handleConnectWallet = () => {
    setIsWalletConnected(true)
  }

  const handleSavePreferences = () => {
    console.log('Saving preferences:', riskPreferences)
    toast({
      title: "Success",
      description: "Your risk preferences have been updated successfully!",
    })
    setShowRiskPreferences(false)
  }

  const handleActionSelect = (action: string) => {
    setSelectedAction(action)
    // Here you would typically open a dialog or navigate to a new page to configure the action
    console.log(`Selected action: ${action}`)
    toast({
      title: "Action Selected",
      description: `You've selected: ${action}. Configure this action in the next step.`,
    })
  }

  const portfolioData = [
    { asset: 'BTC', amount: 2.5, value: 75000, riskScore: 'high' },
    { asset: 'sBTC', amount: 1.8, value: 54000, riskScore: 'medium' },
    { asset: 'STX', amount: 10000, value: 15000, riskScore: 'low' },
  ]

  const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0)
  const growthPercentage = 15.8
  const growthValue = 22800

  if (showRiskPreferences) {
    return (
      <div className="p-6 max-w-[800px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Risk Preferences</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Risk Tolerance Level</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(value) => setRiskPreferences({...riskPreferences, riskTolerance: value})}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low: You prefer minimal exposure to risk and more conservative strategies.</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium: You're comfortable with moderate risk for potential higher returns.</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High: You're willing to accept higher risk for potentially greater rewards.</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferred Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Notify me of transactions above {riskPreferences.alertThreshold} BTC</Label>
            <Slider
              min={100}
              max={10000}
              step={100}
              value={[riskPreferences.alertThreshold]}
              onValueChange={(value) => setRiskPreferences({...riskPreferences, alertThreshold: value[0]})}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Type of Movements to Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            {['Accumulation', 'Distribution', 'Mixed'].map((movement) => (
              <div key={movement} className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id={movement} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRiskPreferences({...riskPreferences, movementsToMonitor: [...riskPreferences.movementsToMonitor, movement]})
                    } else {
                      setRiskPreferences({...riskPreferences, movementsToMonitor: riskPreferences.movementsToMonitor.filter(m => m !== movement)})
                    }
                  }}
                />
                <Label htmlFor={movement}>{movement}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Frequency of Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setRiskPreferences({...riskPreferences, alertFrequency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Asset Preference</CardTitle>
          </CardHeader>
          <CardContent>
            {['BTC', 'sBTC', 'STX'].map((asset) => (
              <div key={asset} className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id={asset} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRiskPreferences({...riskPreferences, assetPreference: [...riskPreferences.assetPreference, asset]})
                    } else {
                      setRiskPreferences({...riskPreferences, assetPreference: riskPreferences.assetPreference.filter(a => a !== asset)})
                    }
                  }}
                />
                <Label htmlFor={asset}>{asset}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSavePreferences} className="w-full">Save Preferences</Button>
      </div>
    )
  }

  if (showPortfolio) {
    return (
      <div className="p-6 max-w-[800px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Asset Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.map((asset) => (
                <div key={asset.asset} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{asset.asset}</h3>
                    <p>{asset.amount} ({((asset.value / totalValue) * 100).toFixed(2)}% of portfolio)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${asset.value.toLocaleString()}</p>
                    <p className={`text-sm ${
                      asset.riskScore === 'low' ? 'text-green-500' :
                      asset.riskScore === 'medium' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      Risk: {asset.riskScore.charAt(0).toUpperCase() + asset.riskScore.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Portfolio Value</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500">+{growthPercentage}%</p>
                <p className="text-sm text-gray-500">+${growthValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => setShowPortfolio(false)} className="mt-6">Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-start mb-8">
        <Image 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202024-11-09%20at%209.21.43%20PM-rY0UGqr2HOx5FWFg9XlptO7LvHzE37.png"
          alt="Safe Sail Logo"
          width={200}
          height={80}
          className="object-contain"
        />
        <div className="w-72">
          <Button 
            variant="default" 
            className="w-full bg-black text-white rounded-xl py-3"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </Button>
          {isWalletConnected && (
            <p className="text-green-500 text-center mt-2">Wallet Connected Successfully</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Current Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-[80px] font-bold text-[#ff4d4d]">75</div>
                  <div className="font-bold">Action: Prepare to hedge</div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle>Risk Score History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-[80px] font-bold text-[#ff4d4d]">+3</div>
                  <div className="font-bold">Increase</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Transaction Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-4">Risk Contributors</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span>Transaction Size</span>
                      <HelpCircle className="w-4 h-4 ml-2" />
                    </div>
                    <div className="flex items-center">
                      <span>Wallet History</span>
                      <HelpCircle className="w-4 h-4 ml-2" />
                    </div>
                    <div className="flex items-center">
                      <span>Movement Type</span>
                      <HelpCircle className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Risk Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Transaction Size:</span>
                      <span className="font-bold">50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wallet History:</span>
                      <span className="font-bold">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Movement Type:</span>
                      <span className="font-bold">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <Button variant="outline" className="rounded-full" onClick={() => setShowRiskPreferences(true)}>
              Risk Preferences
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setShowPortfolio(true)}>
              Portfolio
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  Actions
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select an Action</DialogTitle>
                  <DialogDescription>
                    Choose an action to perform based on risk scores and other parameters.
                  </DialogDescription>
                </DialogHeader>
                <Select onValueChange={handleActionSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liquidate_below_50">Liquidate if risk score falls below 50</SelectItem>
                    <SelectItem value="hold_above_80">Hold until risk score rises above 80</SelectItem>
                    <SelectItem value="hedge_at_70">Implement hedging strategy at risk score 70</SelectItem>
                    <SelectItem value="rebalance_monthly">Rebalance portfolio monthly</SelectItem>
                    <SelectItem value="stop_loss_20">Set stop-loss at 20% portfolio decline</SelectItem>
                  </SelectContent>
                </Select>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Alerts
                <HelpCircle className="w-5 h-5 ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    risk: 'High Risk',
                    time: '2m ago',
                    amount: '5,000 sBTC moved',
                    wallet: 'Wallet: 1A1zP1...',
                    status: 'Increased risk'
                  },
                  {
                    risk: 'Medium Risk',
                    time: '15m ago',
                    amount: '2,500 sBTC moved',
                    wallet: 'Wallet: 0x742d3...',
                    status: 'Decreased risk'
                  },
                  {
                    risk: 'High Risk',
                    time: '1h ago',
                    amount: '10,000 sBTC moved',
                    wallet: 'Wallet: 3J98t1...',
                    status: 'Increased risk'
                  },
                  {
                    risk: 'Low Risk',
                    time: '30m ago',
                    amount: '100 sBTC moved',
                    wallet: 'Wallet: bc1qxy...',
                    status: 'Decreased risk'
                  }
                ].map((alert, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.risk === 'High Risk' ? 'bg-red-500' :
                          alert.risk === 'Medium Risk' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <span className="font-bold">{alert.risk}</span>
                      </div>
                      <span className="text-sm text-gray-500">{alert.time}</span>
                    </div>
                    <div className="text-sm">{alert.amount}</div>
                    <div className="text-sm text-gray-500">{alert.wallet}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <ChevronUp className={`w-4 h-4 ${
                        alert.status.includes('Increased') ? 'text-red-500 rotate-0' : 'text-green-500 rotate-180'
                      }`} />
                      <span>{alert.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}