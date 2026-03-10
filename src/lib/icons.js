// Registry of all Lucide icons used across the app.
// Import only what we need — avoids pulling in the entire lucide-react bundle.
import {
  Code2, Type, Github,
  Braces, Binary, KeyRound, Fingerprint, Clock, Link,
  AlignLeft, FileText, Eye, CaseSensitive, GitCompare, Eraser,
  ArrowRight, Wrench, ChevronRight, Construction, Search,
  Briefcase, ScanSearch, LetterText, FileWarning, Zap, ClipboardList,
  FileType, Combine, Scissors, FileOutput, FileSearch,
  Users, Mail, MessageSquare, CalendarClock, Receipt, FileCheck, UserCheck, LogOut,
  ClipboardCheck, Calculator,
  IndianRupee, TrendingUp, Percent, Home, Award, ArrowUpRight, PiggyBank, Landmark, CreditCard,
  ImageIcon, ImageDown, Minimize2,
  ArrowLeftRight, Pipette, ScanLine,
} from 'lucide-react'

export {
  Code2, Type, Github,
  Braces, Binary, KeyRound, Fingerprint, Clock, Link,
  AlignLeft, FileText, Eye, CaseSensitive, GitCompare, Eraser,
  ArrowRight, Wrench, ChevronRight, Construction, Search,
  Briefcase, ScanSearch, LetterText, FileWarning, Zap, ClipboardList,
  FileType, Combine, Scissors, FileOutput, FileSearch,
  Users, Mail, MessageSquare, CalendarClock, Receipt, FileCheck, UserCheck, LogOut,
  ClipboardCheck, Calculator,
  IndianRupee, TrendingUp, Percent, Home, Award, ArrowUpRight, PiggyBank, Landmark, CreditCard,
  ImageIcon, ImageDown, Minimize2,
  ArrowLeftRight, Pipette, ScanLine,
}

// Resolve a Lucide icon component by its string name.
// Used in card components to keep data clean (string-based icon names).
const iconMap = {
  Code2, Type, Github,
  Braces, Binary, KeyRound, Fingerprint, Clock, Link,
  AlignLeft, FileText, Eye, CaseSensitive, GitCompare, Eraser,
  ArrowRight, Wrench, ChevronRight, Construction, Search,
  Briefcase, ScanSearch, LetterText, FileWarning, Zap, ClipboardList,
  FileType, Combine, Scissors, FileOutput, FileSearch,
  Users, Mail, MessageSquare, CalendarClock, Receipt, FileCheck, UserCheck, LogOut,
  ClipboardCheck, Calculator,
  IndianRupee, TrendingUp, Percent, Home, Award, ArrowUpRight, PiggyBank, Landmark, CreditCard,
  ImageIcon, ImageDown, Minimize2,
  ArrowLeftRight, Pipette, ScanLine,
}

export function getIcon(name) {
  return iconMap[name] ?? null
}
