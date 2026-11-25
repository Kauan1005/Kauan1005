# Converte todos os .docx da pasta informada em PDF usando o Microsoft Word instalado.
param([string]$Dir)
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  Get-ChildItem -Path $Dir -Filter *.docx | Where-Object { $_.Name -notlike '~$*' } | ForEach-Object {
    $doc = $word.Documents.Open($_.FullName, $false, $true)
    $pdf = [System.IO.Path]::ChangeExtension($_.FullName, '.pdf')
    $doc.SaveAs([ref]$pdf, [ref]17)   # 17 = wdFormatPDF
    $pages = $doc.ComputeStatistics(2) # 2 = wdStatisticPages
    $doc.Close([ref]$false)
    Write-Output "$($_.Name) -> $pages pagina(s)"
  }
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
