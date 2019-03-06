Attribute VB_Name = "Module1"
Sub Stock_Table()
    Dim row As Integer
    Dim total As LongLong
    Dim opening As Double
    Dim closing As Double
    
    Cells(1, 9).Value = "Ticker"
    Cells(1, 10).Value = "Yearly Change"
    Cells(1, 11).Value = "Percent Change"
    Cells(1, 12).Value = "Total Stock Volume"
    
    
    opening = Cells(2, 3).Value
    total = Cells(2, 7).Value
    
    row = 2
    lastRow = Cells(Rows.Count, 1).End(xlUp).row
    
    For i = 2 To (lastRow - 1)
    
        If Cells(i, 1).Value <> Cells(i + 1, 1).Value Then
           closing = Cells(i, 6).Value
           
           Cells(row, 9).Value = Cells(i, 1).Value
           Cells(row, 10).Value = closing - opening
           
            If (Cells(row, 10) < 0) Then
                Cells(row, 10).Interior.ColorIndex = 3
            Else
                Cells(row, 10).Interior.ColorIndex = 4
            End If
           
           If opening <> 0 Then
                Cells(row, 11).Value = Format(((closing - opening) / opening), "Percent")
           Else
                Cells(row, 11).Value = 0
           End If
           
           Cells(row, 12).Value = total

           row = row + 1
           opening = Cells(i + 1, 3).Value
           total = Cells(i + 1, 7).Value
           
           
           
        Else
            total = total + Cells(i + 1, 7).Value
            
        End If
    
    Next i
    
    closing = Cells(lastRow, 6).Value
    Cells(row, 9).Value = Cells(lastRow, 1).Value
    Cells(row, 10).Value = closing - opening
    
    If opening <> 0 Then
        Cells(row, 11).Value = Format(((closing - opening) / opening), "Percent")
    Else
        Cells(row, 11).Value = 0
    End If
    
    Cells(row, 12).Value = total
    
    If (Cells(row, 10) < 0) Then
        Cells(row, 10).Interior.ColorIndex = 3
    Else
        Cells(row, 10).Interior.ColorIndex = 4
    End If
    
    Dim maxRow As Integer
    Dim minRow As Integer
    Dim maxVolume As Integer
    
    maxRow = 2
    minRow = 2
    maxVolume = 2
    
    For j = 3 To row
        
        If Cells(j, 11).Value > Cells(maxRow, 11).Value Then
            maxRow = j
        ElseIf Cells(j, 11).Value < Cells(minRow, 11).Value Then
            minRow = j
        End If
        
        If Cells(j, 12).Value > Cells(maxVolume, 12).Value Then
            maxVolume = j
        End If
        
    Next j
        
    Cells(1, 16).Value = "Ticker"
    Cells(1, 17).Value = "Value"
        
    Cells(2, 15).Value = "Greatest % Increase"
    Cells(3, 15).Value = "Greatest % Decrease"
    Cells(4, 15).Value = "Greatest Total Volume"
    
    Cells(2, 16).Value = Cells(maxRow, 9)
    Cells(3, 16).Value = Cells(minRow, 9)
    Cells(4, 16).Value = Cells(maxVolume, 9)
    
    Cells(2, 17).Value = Format(Cells(maxRow, 11).Value, "percent")
    Cells(3, 17).Value = Format(Cells(minRow, 11).Value, "percent")
    Cells(4, 17).Value = Cells(maxVolume, 12).Value
        
End Sub

