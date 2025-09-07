# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Symlink so .NET can find the expected name
RUN ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 \
          /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
    && ls -l /usr/lib/x86_64-linux-gnu/*lept* /usr/lib/x86_64-linux-gnu/*leptonica*

ENV LD_LIBRARY_PATH=/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

COPY --from=build /app/publish .

COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

COPY i2t-Api/Dictionaries /usr/share/hunspell

# Fail if .NET's expected lib name not found
ENTRYPOINT ["/bin/sh", "-c", "ldd /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so || exit 1; dotnet i2t-Api.dll"]
