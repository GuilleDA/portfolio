Version: 0.301
Release: 7%{?dist}
URL: https://www.fontshare.com/fonts/satoshi/
 
%global	common_description	%{expand:
Satoshi is a modernist sans serif typeface. Its design combines typically grotesk-style letterforms, with some characters that are quite geometrically-designed. In terms of its appearance, Satoshi was inspired by Modernism and Industrial-Era graphic and typographic design. The family has five weights on offer, ranging from Light to Black. It is an excellent choice for use in branding, editorial, and poster design. Satoshi’s lowercase ‘a’ and ‘g’ are double-storied; however, single-storied alternates are available, through an OpenType feature. The fonts’ other OpenType features include 10 ligatures per font, as well as alternate versions of the ‘G’ and ’t’. The default numeral style in each of the fonts is proportional lining figures; three other styles of numbers are included, too. There are tabular lining figures, as well as numerators and denominators for typesetting fractions. The fonts’ lining figures have the same height as the uppercase letters. The lowercase’s ascenders are drawn to be slightly taller than the common height of the capital letters and numerals. Each Satoshi font contains ten directional-arrow glyphs, as well as six glyphs of circles, squares, and triangles. There is also a peace sign in the character set, a smiling-face emoji, a check mark, and two versions of the numbers one through nine, each enclosed inside of differently-filled circles. Satoshi is the work of Deni Anggara, an Indonesian designer based in Medan.}
 
%global	foundry		Indian Type Foundry
%global	fontlicense	OFL
%global	fontlicenses	COPYING
%global	fontdocs	NEWS README.md
%global	fontdocsex	%{fontlicenses}
 
%global	fontfamily0	Satoshi
%global	fontsummary0	Modernist sans serif font
%global	fonts0		prebuilt/Satoshi-*.otf
%global	fontsex0	prebuilt/Satoshi-VF.otf
%global	fontconfs0	%{SOURCE1}
%global	fontdescription1	%{expand:
%{common_description}
 
This package contains the non-variable font version of the Satoshi font.}
 
%global	fontfamily1	Satoshi-VF
%global	fontsummary1	Modernist sans serif font (variable)
%global	fonts1		prebuilt/Satoshi-VF.otf
%global	fontconfs1	%{SOURCE2}
%global fontdescription1	%{expand:
%{common_description}
 
This package contains the variable font version of the Satoshi font.}
 
Source0: http://download.gnome.org/sources/cantarell-fonts/0.301/cantarell-fonts-%{version}.tar.xz
 
BuildRequires: gettext
BuildRequires: meson
 
%fontpkg -a
 
%prep
%autosetup -n cantarell-fonts-%{version}
 
%build
%meson
%meson_build
%fontbuild -a
 
%install
%fontinstall -a
 
%check
%fontcheck -a
 
%fontfiles -a
 
%changelog
* Mon May 9 2022 Lleyton Gray <lleyton@fyralabs.com> - 0.301-7
- Initial release